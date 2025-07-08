import { AiFillDelete } from "react-icons/ai"
import { FiEdit } from "react-icons/fi"
import { ordersApi } from "../../features/api/ordersApi"
import { useSelector } from "react-redux"
import type { RootState } from "../../app/store"
import { PuffLoader } from "react-spinners"
import Swal from "sweetalert2"

interface OrderDetails {
  orderId: number,
  userId: number,
  mealId: number,
  createdAt: string,
  status: string,
  meal: {
    mealName: string,
    mealBadge: string,
    mealPrice: number,
    mealUrl: string
  }
}

export const Orders = () => {

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const[updateOrder] = ordersApi.useUpdateOrderMutation()

  const userId = user?.userId

  const { data: orderData = [], isLoading, error } = ordersApi.useGetAllOrderForOneUserByIdQuery(userId, {
    skip: !isAuthenticated
  })
  console.log("🚀 ~ Orders ~ orderData:", orderData)

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "confirmed": return "badge-success";
      case "canceled": return "badge-error";
      case "pending": return "badge-warning";
      default: return "badge-primary";
    }
  }

  const handleEdit = async(orderId:number)=>{
    Swal.fire({
                title: "Are you sure?",
                text: "You want to cancel the order?",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#2563eb",
                cancelButtonColor: "#f44336",
                confirmButtonText: "Yes, Cancel it!",
            }).then(async (result) => {
              const updatePayload ={
                orderId:orderId,
                status:"canceled"
              }
                if (result.isConfirmed) {
                    try {
                        const res = await updateOrder(updatePayload).unwrap()
                        console.log(res)
                        Swal.fire("Canceled!", res.message, "success");
                    } catch (error) {
                        Swal.fire("Something went wrong","Pleese Try Again", "error")
                    }                
                }
            });
  }



  return (
    <>
      <div className="text-2xl font-bold text-center mb-4 text-orange-400">My Orders Page</div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                #
              </th>
              <th>Meal</th>
              <th>Price</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              error ? (
                <div>
                  error while fetching your order..try again
                </div>
              ) : isLoading ? (
                <div>
                  <PuffLoader />
                </div>
              ) : orderData?.length === 0 ? (
                <tr>
                  <div>No orders available 😎</div>
                </tr>
              ) : (
                orderData?.map((order: OrderDetails) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={order.meal?.mealUrl}
                              alt="Avatar Tailwind CSS Component" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{order.meal.mealName}</div>
                          <div className="text-sm opacity-50">{order.meal.mealBadge}</div>
                        </div>
                      </div>
                    </td>
                    <td>KSH:{order.meal.mealPrice}</td>
                    <td>{order.createdAt}</td>
                    <td>  <div className={`badge badge-outline ${getStatusBadge(order.status)} `}>
                      {order.status}
                    </div></td>
                    <td>
                      <button className="text-blue-700 hover:text-blue-500 btn btn-sm btn-outline"
                      onClick={()=>handleEdit(order.orderId)}
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
    </>
  )
}
