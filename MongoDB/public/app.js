const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const saveButton = document.querySelector("#save-button");
const cancelButton = document.querySelector("#cancel-button");
const loadButton = document.querySelector("#load-button");
const formHeading = document.querySelector("#form-heading");
const statusMessage = document.querySelector("#status");
const recordList = document.querySelector("#records");

let editingId = null;

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!response.ok) {
    let details;
    try {
      details = (await response.json()).error;
    } catch {
      details = await response.text();
    }
    throw new Error(details || `Request failed (HTTP ${response.status}).`);
  }
  return response.status === 204 ? null : response.json();
}

function clearForm() {
  editingId = null;
  titleInput.value = "";
  descriptionInput.value = "";
  formHeading.textContent = "Create record";
  saveButton.textContent = "Create";
  cancelButton.hidden = true;
}

function beginEdit(record) {
  editingId = record.id;
  titleInput.value = record.title;
  descriptionInput.value = record.description;
  formHeading.textContent = "Edit record";
  saveButton.textContent = "Save changes";
  cancelButton.hidden = false;
  titleInput.focus();
}

async function loadRecords() {
  try {
    const records = await request("/api/records");
    recordList.replaceChildren();
    if (records.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "No records yet.";
      recordList.append(empty);
    }

    for (const record of records) {
      const item = document.createElement("li");
      const text = document.createElement("span");
      text.textContent = `${record.title}: ${record.description} `;

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => beginEdit(record));

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteRecord(record.id));

      item.append(text, editButton, " ", deleteButton);
      recordList.append(item);
    }
    statusMessage.textContent = "Records loaded.";
  } catch (error) {
    statusMessage.textContent = `Could not load records: ${error.message}`;
  }
}

async function saveRecord() {
  const record = { title: titleInput.value.trim(), description: descriptionInput.value.trim() };
  if (!record.title || !record.description) {
    statusMessage.textContent = "Enter a title and description.";
    return;
  }

  try {
    await request(editingId ? `/api/records/${editingId}` : "/api/records", {
      method: editingId ? "PUT" : "POST",
      body: JSON.stringify(record),
    });
    statusMessage.textContent = editingId ? "Record updated." : "Record created.";
    clearForm();
    await loadRecords();
  } catch (error) {
    statusMessage.textContent = `Could not save record: ${error.message}`;
  }
}

async function deleteRecord(id) {
  try {
    await request(`/api/records/${id}`, { method: "DELETE" });
    statusMessage.textContent = "Record deleted.";
    if (editingId === id) clearForm();
    await loadRecords();
  } catch (error) {
    statusMessage.textContent = `Could not delete record: ${error.message}`;
  }
}

saveButton.addEventListener("click", saveRecord);
cancelButton.addEventListener("click", clearForm);
loadButton.addEventListener("click", loadRecords);
loadRecords();
