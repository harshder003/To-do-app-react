import { useState } from "react";
import { useCookies } from "react-cookie";

function Modal({mode, setShowModal, task}){
  const [cookies, setCookies, removeCookie] = useCookies(null)
  const editMode = mode === 'edit' ? true: false

  const [data,setData] = useState({
    user_email: editMode ? task.user_email: cookies.Email,
    title: editMode ? task.title:"",
    description: editMode ? task.description:"",
    progress: editMode ? task.progress:0,
    date: editMode ? "": new Date(),
  })

  const postData = async (e) => {
    try{
      const response = await fetch('http://localhost:8000/todos',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      })
      console.log(response)
    }catch(err){
      console.log(err)
    
    }
  }

  const editData = async (e) => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${task.id}`,{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    console.log('change',e)
    const {name, value} = e.target

    setData(data => ({
      ...data,
      [name]:value,
    }))
    console.log(data)
  }

    return (
      <div className="overlay">
        <div className="modal">
          <div className="form-title-container">
            <h3>Let's {mode} your task.</h3>
            <button onClick={() => setShowModal(false)}>X</button>
          </div>
          <form action="">
            <input required
            maxLength={30}
            placeholder="Your task goes here"
            name="title"
            value={data.title}
            onChange={handleChange}
             type="text" /> <br />
             <input 
             maxLength={80}
             type="text"
             placeholder="Description"
             name="description"
             onChange={handleChange} 
             value={data.description}
             /> <br />
             <label htmlFor="range"> Drag to select your current progress</label>
            <input required
             type="range"
             id="range"
             className="range"
             min={0}
             max={100}
             name="progress"
            //  value={""}
             onChange={handleChange}
             />
            <input 
            className={mode}

            type="submit" onClick={editMode ? editData: postData} />
          </form>
        </div>
      </div>
    );
  }
  
  export default Modal;