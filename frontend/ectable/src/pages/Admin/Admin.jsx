const Admin = () => {
  return (
    <>
      <div>Admin page </div>
      <div>
        <button onClick={() => (window.location.href = "/restManagement")}>
          1. Go to Restaurant Management
        </button>
      </div>
      <div>
        <button onClick={() => (window.location.href = "/RestaurantSignup")}>
          2. Go to Restaurant Signup
        </button>
      </div>
    </>
  );
};

export default Admin;
