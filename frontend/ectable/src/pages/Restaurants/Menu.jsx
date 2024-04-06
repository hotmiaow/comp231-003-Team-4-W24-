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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function Menu() {
  const restID = Cookies.get("restID");
  console.log(`Rest ID: ${restID}`);
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);

   const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: '' });
   const [isDeleted, setIsDeleted] = useState(false);
   const [isUpdated, setIsUpdated] = useState(false);
   const [open, setOpen] = useState(false);

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

  const handleDelete = async (item) => {

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
          setIsUpdated(true);
          editMenus(response.data);
          setNewMenuItem({ name: '', description: '', price: '' });
        }
      }
      catch (e){
        console.log('update failed', e.errorMessage)

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
                <IconButton onClick={handleAdd}>
                <AddCircleOutlineIcon/>
                </IconButton>
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