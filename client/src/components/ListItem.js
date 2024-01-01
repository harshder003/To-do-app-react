import TickIcon from './TickIcon'
import ProgressBar from './ProgressBar'
import { useState } from 'react'
import Modal from './Modal';

function ListItem({task}){
  const deleteData = async (e) => {
    try {
      const response = await fetch(`http://localhost:8000/todos/delete/${task.id}`,{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(task)
      })
      window.location.reload()
  } catch (error) {
    console.log(error)
  }}
  const [showModal,setShowModal] = useState(false);
    return (
      <li className="listItem">
        <div className="info-container">
          <TickIcon />
          <h4 className="task-title">{task.title}</h4>
          <ProgressBar />
          <p className="task-description">{task.description}</p>
        </div>

        <div className="button-container">
          <button className="edit" onClick={() => setShowModal(true)}>EDIT</button>
          <button className="delete" onClick={deleteData}>DELETE</button>
        </div>
        {showModal && <Modal mode={'edit'} setShowModal={setShowModal} task={task} />}
      </li>
    );
  }
  
  export default ListItem;