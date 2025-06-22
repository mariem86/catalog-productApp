import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listOrders, deleteOrder } from '../js/actions/orderActions';

function OrdersScreen(props) {
  const orderList = useSelector(state => state. orderListReducer);
  const { loading, orders, error } = orderList;

  const orderDelete = useSelector(state => state.orderDeleteReducer);
  const { loading: loadingDelete, success: successDelete, error: errorDelete } = orderDelete;

  const dispatch = useDispatch();

  useEffect(() => {
     console.log("Token in localStorage:", localStorage.getItem("token"));
    dispatch(listOrders());
    return () => {
      //
    };
  }, [successDelete]);

  const deleteHandler = (order) => {
    dispatch(deleteOrder(order._id));
  }
  return loading ? <div>Loading...</div> :
    <div className="content content-margined">

      <div className="order-header">
        <h3>Orders</h3>
      </div>
      <div className="order-list">

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>USER</th>
              <th>PAID</th>
              <th>PAID AT</th>
              <th>DELIVERED</th>
              <th>DELIVERED AT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
          {Array.isArray(orders) && orders.length > 0 ? (
  orders.map(order => (
    <tr key={order._id}>
      <td>{order._id}</td>
      <td>{order.createdAt}</td>
      <td>{order.totalPrice}</td>
      <td>{order.user?.name || 'Utilisateur supprimé'}</td>
      <td>{order.isPaid ? 'Oui' : 'Non'}</td>
      <td>{order.paidAt ? order.paidAt : '-'}</td>
      <td>{order.isDelivered ? 'Oui' : 'Non'}</td>
      <td>{order.deliveredAt ? order.deliveredAt : '-'}</td>
      <td>
        <Link to={`/order/${order._id}`} className="button secondary">Details</Link>
        {' '}
        <button type="button" onClick={() => deleteHandler(order)} className="button secondary">Delete</button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="9">Aucune commande trouvée.</td>
  </tr>
)}
          </tbody>
        </table>

      </div>
    </div>
}
export default OrdersScreen;