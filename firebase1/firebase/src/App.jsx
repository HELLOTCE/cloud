import { useState } from "react";

export default function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  async function getError(response) {
    const details = (await response.text()).trim();
    return details || `Server returned HTTP ${response.status}. Check the npm run server terminal.`;
  }

  async function loadRecords() {
    try {
      const response = await fetch("/api/records");
      if (!response.ok) throw new Error(await getError(response));
      setRecords(await response.json());
      setMessage("Records loaded.");
    } catch (error) {
      setMessage(`Could not load records: ${error.message}`);
    }
  }

  async function saveRecord() {
    if (!title.trim() || !description.trim()) {
      setMessage("Enter a title and description.");
      return;
    }

    try {
      const response = await fetch(editId ? `/api/records/${editId}` : "/api/records", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      });
      if (!response.ok) throw new Error(await getError(response));
      setTitle("");
      setDescription("");
      setEditId(null);
      setMessage(editId ? "Record updated." : "Record created.");
      await loadRecords();
    } catch (error) {
      setMessage(`Could not save record: ${error.message}`);
    }
  }

  async function deleteRecord(id) {
    try {
      const response = await fetch(`/api/records/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(await getError(response));
      setMessage("Record deleted.");
      await loadRecords();
    } catch (error) {
      setMessage(`Could not delete record: ${error.message}`);
    }
  }

  function cancelEdit() {
    setEditId(null);
    setTitle("");
    setDescription("");
  }

  return (
    <main>
      <h1>Firebase records</h1>
      <p>These operations use your Firebase service-account key on the local server.</p>

      <h2>{editId ? "Edit record" : "Create record"}</h2>
      <p><label>Title <input value={title} onChange={event => setTitle(event.target.value)} /></label></p>
      <p><label>Description <textarea value={description} onChange={event => setDescription(event.target.value)} /></label></p>
      <button onClick={saveRecord}>{editId ? "Save changes" : "Create"}</button>{" "}
      {editId && <button onClick={cancelEdit}>Cancel</button>}{" "}
      <button onClick={loadRecords}>Load records</button>

      <p role="status">{message}</p>
      <h2>Stored records</h2>
      {records.length === 0 ? <p>No records loaded.</p> : (
        <ul>
          {records.map(record => (
            <li key={record.id}>
              <strong>{record.title}</strong>: {record.description}{" "}
              <button onClick={() => {
                setEditId(record.id);
                setTitle(record.title);
                setDescription(record.description);
              }}>Edit</button>{" "}
              <button onClick={() => deleteRecord(record.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
