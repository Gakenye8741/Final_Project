import { FiEdit } from "react-icons/fi"
import { userApi } from "../../features/api/userApi"
import type { RootState } from "../../app/store"
import { useSelector } from "react-redux"
import { PuffLoader } from "react-spinners"
import { useState } from "react"
import { FaTimes } from "react-icons/fa"
import { SaveIcon } from "lucide-react"

interface UserDetail {
  userId: number,
  firstName: string
  lastName: string
  profileUrl: string
  email: string,
  userType: string,
  createdAt: string
}

const getUserTypeBadge = (userType: string) => {
  switch (userType) {
    case "admin": return "badge-success";
    case "disabled": return "badge-error";
    case "member": return "badge-warning";
    default: return "badge-primary";
  }
}

export const AllUsers = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { data: usersData = [], isLoading: userDataIsLoading, error } = userApi.useGetAllUsersProfilesQuery({
    skip: !isAuthenticated
  })

   const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit =async()=>{

  }


  return (
    <>
      <div className="text-2xl font-bold text-center mb-4 text-orange-400">All Users Page</div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th> # </th>
              <th>User</th>
              <th>Joined On</th>
              <th>User Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              error ? (
                <div>
                  error while fetching your order..try again
                </div>
              ) : userDataIsLoading ? (
                <PuffLoader color="#0aff13" />
              ) : usersData.length === 0 ? (
                <tr>
                  <div>No orders available 😎</div>
                </tr>
              ) : (
                usersData?.map((user: UserDetail) => (
                  <tr key={user.userId}>
                    <th> {user.userId} </th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={user.profileUrl}
                              alt="Avatar Tailwind CSS Component" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-orange-500">{user.firstName} {user.lastName}</div>
                          <div className="text-sm opacity-50">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td> {new Date(user.createdAt).toLocaleString()}</td>
                    <td>
                      <div className={`badge badge-outline ${getUserTypeBadge(user.userType)} `}>
                        {user.userType}
                      </div>
                    </td>
                    <td>
                      <button className="text-blue-700 hover:text-blue-500 btn btn-sm btn-outline"
                        onClick={handleModalToggle}
                      >
                        <FiEdit />
                      </button>
                     
                    </td>
                  </tr>
                ))
              )
            }           
          </tbody>
        </table>
      </div>
       {isModalOpen && (
              <div className="modal modal-open">
                <div className="modal-box">
                  <div className="flex justify-center items-center mb-4 ">
                    <h2 className="text-2xl font-bold text-orange-500 ">Change User Type</h2>
                  </div>
                  <form onSubmit={()=>handleSubmit()}>
                    <div className="mb-4">
                      <label htmlFor="firstName" className="block text-sm font-medium text-orange-500">User Type</label>
                      <select>
                        <option value="">Select UserType</option>
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>                  
                    
                    <div className="flex justify-end">
                      <button onClick={handleModalToggle} className=" btn mr-2 btn-error">
                        <FaTimes /> Cancel
                      </button>
                      {/* <button type="submit" className="btn btn-primary" disabled={isLoading}> */}
                      <button type="submit" className="btn btn-primary" >                 
                        <SaveIcon /> Save Profile  {/* {isLoading ? 'Updating...' : 'Update Profile'} */}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
    </>
  )
}
