let loading = false;
let features = document.getElementById("features");

const isLoading = (loading) => {
  const load = document.getElementById("loading");
  if (loading) {
    load.classList.remove("d-none");
  } else {
    load.classList.add("d-none");
  }
};

const getData = async (start, end) => {
  isLoading(true);
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/ai/tools"
    );
    const data = await res.json();
    displayData(data.data.tools, start, end);

    // sort by button click
    document
      .getElementById("sort-by-btn")
      .addEventListener("click", () => sortByDate(data.data.tools));

    isLoading(false);
  } catch (error) {
    console.log(error);
    isLoading(false);
  }
};
getData(0, 6);

// sort by date functionality
function sortByDate(data) {
  features.innerHTML = "";
  data.sort(function (a, b) {
    return new Date(b.published_in) - new Date(a.published_in);
  });
  displayData(data);
}

const displayData = (data, start = 0, end = 12) => {
  data.slice(start, end).map((item) => {
    const div = document.createElement("div");
    div.classList.add("col");
    div.innerHTML = `<div class="card h-100">
    <img src=${item.image} class="card-img-top" alt="" />
    <div class="card-body">
      <h4 class="card-title">Features</h4>
      <ul class="card-text">
        ${displayListArrayType(item.features)}
      </ul>
    </div>
    <div
      class="card-footer d-flex justify-content-between align-items-center"
    >
      <div>
        <h4 class="card-title">${item.name}</h4>
        <p>${item.published_in}</p>
      </div>

      <button onclick="loadModalDetails('${
        item.id
      }')" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#mealDetails">
        Details
      </button>
      
    </div>
  </div>`;
    features.appendChild(div);
    // features = "";
  });
};

// display the list of any array type
function displayListArrayType(list) {
  if (list !== null) {
    let total = "";
    for (let i = 0; i < list.length; i++) {
      total += `<li>
  ${list[i]}
</li>`;
    }
    return total;
  } else {
    return `<li>No data found</li>`;
  }
}

// display the list of the features in modal
function displayFeaturesListModal(features) {
  let total = "";
  for (const feature in features) {
    total += `<li>
  ${features[feature].feature_name}
</li>`;
  }
  return total;
}

// load the individual item details
async function loadModalDetails(id) {
  const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayModalDetails(data.data);
  } catch (error) {
    console.log(error);
  }
}

// display modal details
function displayModalDetails(data) {
  document.getElementById(
    "mealDetailsBody"
  ).innerHTML = `<div class="card modal-left ps-3">
<div class="card-body">
  <h5 class="card-text fw-bold mb-3">
    ${data.description}
  </h5>
  <div class="d-lg-flex gap-2 text-center">
    <div class="bg-white text-success fw-bold p-2 rounded">
      <span>${data.pricing ? data.pricing[0].price : "No data found"}</span>
      <span>${data.pricing ? data.pricing[0].plan : "No data found"}</span>
    </div>
    <div class="bg-white text-warning fw-bold p-2 rounded">
    <span>${data.pricing ? data.pricing[1].price : "No data found"}</span>
    <span>${data.pricing ? data.pricing[1].plan : "No data found"}</span>
    </div>
    <div class="bg-white text-danger fw-bold p-2 rounded">
    <span>${data.pricing ? data.pricing[2].price : "No data found"}</span>
    <span>${data.pricing ? data.pricing[2].plan : "No data found"}</span>
    </div>
  </div>
  <div class="d-lg-flex justify-content-around mt-4">
    <div>
      <h5 class="card-title fw-bold">Features</h5>
      <ul class="">
        ${displayFeaturesListModal(data.features)}
      </ul>
    </div>
    <div>
      <h5 class="card-title fw-bold">Integrations</h5>
      <ul>
        ${displayListArrayType(data.integrations)}
      </ul>
    </div>
  </div>
</div>
</div>

<div class="card modal-right">
<span class="accuracy">${data.accuracy.score * 100}% accuracy</span>
<img src=${data.image_link[0]} class="card-img-top p-4 rounded" alt="" />
<div class="card-body text-center">
  <h5 class="card-title fw-bold">${
    data.input_output_examples
      ? data.input_output_examples[0].input
      : "Can you give any example?"
  }</h5>
  <p class="card-text">
    ${
      data.input_output_examples
        ? data.input_output_examples[0].output
        : "No! Not Yet! Take a break!!!"
    }
  </p>
</div>
</div>`;
}

// see more button functionality
const seeMoreBtn = document.getElementById("see-more-btn");
seeMoreBtn.addEventListener("click", () => {
  getData(6);
  seeMoreBtn.classList.add("d-none");
});
