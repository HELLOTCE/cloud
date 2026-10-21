import {useState} from "react"
import {Dropbox} from "dropbox"
  

const dbx=new Dropbox({ 
  accessToken: "YOUR_DROPBOX_ACCESS_TOKEN"
})
export default function App(){ 
  const[msg,setMsg]=useState("");
const[file,setfile]=useState(null);
  async function upload(){ 
    if(!file)return "file not found"
    try{ 
      await dbx.filesUpload({ 
        path:"/"+file.name,
        contents:file,
        mode:{ 
          ".tag":"overwrite"
        }
      });
      setMsg("file uploaded");
    }
    catch(e){ 
         console.log("Full error:", e);
  console.log("Error details:", e.error);

  setMsg(
    "Upload failed: " +
    JSON.stringify(e.error || e.message)
  );
    }
  }
  return(
    <div>
      <input type="file" onChange={e=> setfile(e.target.files[0])}/>
      <button onClick={upload}>Upload</button>

      <p>{msg}</p>
    </div>
  );
}