import { Outlet } from "react-router-dom"
import ManageNavBar from '../components/ManageNavBar'

const ManageLayout = () => {
  return (
  <>
    <ManageNavBar />
    <Outlet />
  </>
  )
}

export default ManageLayout
