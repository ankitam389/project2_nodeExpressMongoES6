const id = new URLSearchParams(location.search).get("id");

async function setUp() {
  const loggedIn = await checkLogin();
  const pkg = await loadPackage();
  fillForm(pkg);

  if (!loggedIn) {
    document.querySelector("#updateButton").disabled = true;
    document.querySelector("#cancelButton").disabled = true;
  }

  const userId = loggedIn?.userId;
  const packageOwnerId = await pkg?.ownerId;

  if (userId !== packageOwnerId) {
    console.log(
      `userId ${userId} not found or packageOwnerId ${packageOwnerId}`
    );
    document.querySelector("#updateButton").disabled = true;
    document.querySelector("#cancelButton").disabled = true;
  }
}

async function checkLogin() {
  const res = await fetch("/api/auth/me");
  if (!res.ok) return null;
  return res.json();
}

async function loadPackage() {
  const res = await fetch(`/api/packages/${id}`);
  if (!res.ok) return null;
  return res.json();
}

async function updatePackage(data) {
  const res = await fetch(`/api/packages/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res;
}

function fillForm(pkg) {
  form.elements.packageName.value = pkg.name;
  form.elements.ecosystem.value = pkg.ecosystem;
  form.elements.license.value = pkg.license;
  form.elements.licenseType.value = pkg.licenseType;
  form.elements.version.value = pkg.version;
  form.elements.homepage.value = pkg.homepage;
  form.elements.repository.value = pkg.repository;
  form.elements.description.value = pkg.description;
  form.elements.tags.value = pkg.tags;
}

// Cancel-button
document.querySelector("#cancelButton").addEventListener("click", async () => {
  location.href = `/package.html?id=${id}`;
});

// LOAD PACKAGE: Create Variables and event listeners and validate data
const form = document.querySelector("#packageForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const packageName = form.elements.packageName.value;
  const ecosystem = form.elements.ecosystem.value;
  const license = form.elements.license.value;
  const licenseType = form.elements.licenseType.value;
  const version = form.elements.version.value;
  const homepage = form.elements.homepage.value;
  const repository = form.elements.repository.value;
  const description = form.elements.description.value;
  const tags = form.elements.tags.value;
  const packageCapture = {};

  packageCapture.id = id;
  packageCapture.ecosystem = ecosystem;
  packageCapture.name = packageName;
  packageCapture.description = description;
  packageCapture.homepage = homepage;
  packageCapture.license = license;
  packageCapture.licenseType = licenseType;
  packageCapture.repository = repository;
  packageCapture.tags = tags;
  packageCapture.version = version;
  const res = await updatePackage(packageCapture);
  if (!res.ok) {
    const err = await res.json();
    document.querySelector("#formError").textContent = err.error;
    document.querySelector("#formError").hidden = false;
    return;
  }
  // const success = await res.json();
  location.href = `/package.html?id=${id}`;
});

setUp();
