import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { fetchMenuForRestaurant } from "../Chef/api-MenuMnagement";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent
} from "@material-ui/core";
import {createMenu, updateMenu,removeMenu} from "./api-menu"
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

function Menu() {
  const restID = Cookies.get("restID");
  console.log(`Rest ID: ${restID}`);
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  // const [formFields, setFormFields] = useState([
  //   { name: '', description: '', price: '' },
  // ])
   const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: '' });
   const [isDeleted, setIsDeleted] = useState(false);
   const [isUpdated, setIsUpdated] = useState(false);
   const [open, setOpen] = useState(false);
   const [editMenu, setEditMenu] = useState([]);
   const [showSuccessDialog, setShowSuccessDialog] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const editMenus = (updatedItem) => {
    setEditItem((currentItems) => 
      currentItems.map((item) => 
        item._id === updatedItem._id ? updatedItem : item
      )
    );
  };

  const fetchMenu = async () => {
        try {
          const credentials = {
            t: Cookies.get("accessToken"),
          };
          const menuData = await fetchMenuForRestaurant(
            { restaurantId: restID },
            credentials
          );
          console.log(menuData)
          setMenuItems(menuData);
          setIsUpdated(false);
          setIsDeleted(false);
        } catch (error) {
          console.error("Error fetching menu items:", error);
        }
      };


 useEffect(() => {
    fetchMenu();
  }, [restaurantId, isUpdated, isDeleted]);

  // const handleFormChange = (event, index) => {
  //   let data = [...formFields];
  //   data[index][event.target.name] = event.target.value;
  //   setFormFields(data);
  // }

  // const submit = (e) => {
  //   e.preventDefault();
  //   console.log(formFields)
  // }

  // const addFields = () => {
  //   let object = {
  //     name: '',
  //     description: '',
  //     price:''
  //   }

  //   setFormFields([...formFields, object])
  // }

  // const removeFields = (index) => {
  //   let data = [...formFields];
  //   data.splice(index, 1)
  //   setFormFields(data)
  // }

  const handleDelete = async (item) => {
    // Implement functionality to delete an item by its id
    // Call API to delete the item, then fetch and update the menu items list
      console.log(item);
      console.log(restID)

      const deleteItem = {
    
        name: item.name,
        description: item.description,
        price: item.price,
        restaurantId: restID
      }
      console.log(deleteItem)
      removeMenu(deleteItem).then(()=>{
        console.log(`menu deleted.`)
        setIsDeleted(true);
      })
  };

  const handleAdd = async () => {
    // Implement functionality to add a new menu item
    // Call API to add the new item, then fetch and update the menu items list
    if(newMenuItem.name &&  newMenuItem.description && newMenuItem.price)
    {
        
        console.log(restID)
        const menu = {
          name: newMenuItem.name,
          description: newMenuItem.description,
          price: newMenuItem.price,
          restaurantId: restID
        }

        const response = await createMenu(menu);
        console.log(response)
        if(response.status === 200 || response.status === 201 ){
          console.log("New Menu added.")
        }
        await fetchMenu();
    }
    
    setNewMenuItem({ name: '', description: '', price: '' }); // Reset form after adding
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewMenuItem(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEdit = (item) => {
    console.log(item);

    setNewMenuItem(item);
    setOpen(true);
  }

  const handleClose = async() => {
        setOpen(false);
        setNewMenuItem({ name: '', description: '', price: '' });
        await fetchMenu();
      };

  const handleSave = async () => {
      // Implement update method
      console.log(newMenuItem.name);
      console.log(newMenuItem.description);
      console.log(newMenuItem.price);
      console.log(newMenuItem._id);


      const updatedMenu = {
        id: newMenuItem._id,
        name : newMenuItem.name,
        description : newMenuItem.description,
        price : newMenuItem.price,
        restaurantId: restID
      };

      console.log(updatedMenu);

      try{
        const response = await updateMenu(updatedMenu);

        console.log(response)

        if(response.error){
          console.log(response.error)
        }
        else{
          console.log('update successful', response)
          // setShowSuccessDialog(true);
          setIsUpdated(true);
          editMenus(response.data);
          setNewMenuItem({ name: '', description: '', price: '' });
        }
      }
      catch (e){
        console.log('update failed', e.errorMessage)
        // setShowSuccessDialog(false);
        // setIsUpdated(false);
      }
    };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {menuItems.map((item,index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(item)}>
                  <DeleteIcon/>
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(item)}>
                  <EditIcon/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <TextField name="name" value={newMenuItem.name} onChange={handleChange} placeholder="Name" />
              </TableCell>
              <TableCell>
                <TextField name="description" value={newMenuItem.description} onChange={handleChange} placeholder="Description" />
              </TableCell>
              <TableCell>
                <TextField name="price" value={newMenuItem.price} onChange={handleChange} placeholder="Price" />
              </TableCell>
              <TableCell>
                <Button onClick={handleAdd}>Add</Button>
                {/* <Button onClick={handleDelete}>Delete</Button> */}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit Menu</DialogTitle>
              <DialogContent>
                <TextField
                  label="Name"
                  name='name'
                  value={newMenuItem.name || ""}
                  onChange={handleChange}
                />
                <TextField
                  label="Description"
                  name='description'
                  value={newMenuItem.description || ""}
                  onChange={handleChange}
                />
                <TextField
                  label="Price"
                  name='price'
                  value={newMenuItem.price || ""}
                  onChange={handleChange}
                />
                </DialogContent>
                  <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleSave}>Save</Button>
                  </DialogActions>
        </Dialog>
    </div>
  );
}

export default Menu;