import { useEffect, useState } from "react";
import axios from "axios";
import UserTable from "../../components/users/UserTable.jsx";
import UserEditForm from "./UserEditForm.jsx";
import ConfirmDeleteModal from "./UserDeleteModal.jsx";
import { useTranslation } from "react-i18next"; // ← الترجمة

export default function UsersList() {
  const { t } = useTranslation(); // ← استخدام الترجمة

  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [reload, setReload] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        t("fetchUsersError", "حدث خطأ أثناء جلب المستخدمين:"),
        error
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [reload]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${deleteUser._id}`);
      setReload((prev) => !prev);
      setDeleteUser(null);
    } catch (error) {
      console.error(t("deleteUserError", "حدث خطأ أثناء حذف المستخدم:"), error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleCancelEdit = () => {
    setEditUser(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {t("usersListTitle", "قائمة المستخدمين")}
      </h1>

      {/* مودال حذف */}
      {deleteUser && (
        <ConfirmDeleteModal
          user={deleteUser}
          onConfirm={handleDelete}
          onCancel={() => setDeleteUser(null)}
        />
      )}

      {/* نموذج التعديل */}
      {editUser ? (
        <UserEditForm
          user={editUser}
          onReload={() => setReload((prev) => !prev)}
          onCancel={handleCancelEdit}
        />
      ) : (
        <UserTable users={users} onEdit={handleEdit} onDelete={setDeleteUser} />
      )}
    </div>
  );
}
