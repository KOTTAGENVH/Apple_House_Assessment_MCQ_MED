import { Avatar, Card, CardContent, CardHeader, Typography} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import"../CSS/Feedback.css"

  //Feecback function
    const Feedback = ({
      title,
      description,
      userName,
      id,
      userid,
      User,
      isApproved,
    }) => {
  
      //Use states
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [Title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Image, setImage] = useState("");
    const user_id = useSelector((state) => state.user._id);
    const [approved, setApproved] = useState(isApproved);
    const Approved = useSelector((state) => state.isApproved);

    //Approval of user feedbacks on forum
    const handleApprove = async () => {
      try {
        const response = await axios.put(`http://localhost:4000/feedbacks/approveFeedback/${id}`, {
          isApproved: true
        });
        setApproved(response.data.isApproved);
      } catch (error) {
        console.error(error);
      }
    };

    
    
    //Handle Edit function
    const handleEdit = () => {
      axios.put(`http://localhost:4000/feedbacks/updateFeedback/${id}`, {
        title: Title,
        description: Description,
        user: User,
      })
        .then((response) => {
          if (response) {
          window.location.reload(false);
        }
      });
    };
    const isAdmin = useSelector((state) => state.user.isAdmin);
    const thisuser = useSelector((state) => state.user._id);

  //Sending the delete request to the backend
    const deleteRequest = async () => {
    const res = await axios
      .delete(`http://localhost:4000/feedbacks/deletefeedback/${id}`)
      .catch((err) => console.log(err));
    const data = await res.data;
      return data;
    };

  //After deleting navigate back to forum page to see all feedbacks/Posts
    const handleDelete = () => {
    deleteRequest()
      .then(() => navigate("/"))
      .then(() => navigate("/feedbacks"));
      window.location.reload(false);
    };


     if(!isAdmin && isApproved.toString()==="false"){
      return Feedback;
     }

    return (
    //UI to display feedback
      <div className="feedback">
        <Card
         sx={{
          width: "40%",
          margin: "auto",
          mt: 2,
          padding: 2,
          boxShadow: "5px 5px 10px #ccc",
          ":hover": {
            boxShadow: "10px 10px 20px #ccc",
          },
         }}
        >

        <CardHeader
          avatar={
            <Avatar
              /*className={classes.font}*/ sx={{ bgcolor: "red" }}
              aria-label="recipe"
            >
              {userName}
            </Avatar>
          }
      
          title={title}
    
        />
      
        <CardContent>
          <hr />
          <br />
          <Typography
            /*className={classes.font}*/ variant="body2"
            color="text.secondary"
          >
            <b>{userName}</b> {": "} {description}
          </Typography>

        </CardContent>
        {isAdmin ? ( /*If Admin*/
          <div>
             {approved ? ( //Check Approved
              <p>Approved: {approved.toString()}</p>
            ) : (
              <button className="btn btn-primary" onClick={handleApprove}>Approve</button> 
            )}
            <button className="btn btn-danger" onClick={() => handleDelete()}>
              Reject
            </button>
           
          </div>
        ) : (

          thisuser == userid && ( //check user == user
            <button className="btn btn-primary" onClick={handleShow}>
              Edit
            </button>
          )
          )}
          
          {(thisuser == userid && ( //check user == user
            <button className="btn btn-danger" onClick={() => handleDelete()}>
            Delete
          </button>
          ))}
         
      
      </Card>
      
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
          /*Modal for update feedback*/
            placeholder="Title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="form-control"
          />
          <br></br>
          <input
            placeholder="Description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            className="form-control"
          />
          <br></br>
       
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Feedback;