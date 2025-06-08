import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import UserTable from "../../components/users/UserTable.jsx";
import UserEditForm from "./UserEditForm.jsx";
import ConfirmDeleteModal from "./UserDeleteModal.jsx";

const fetchUsers = async () => {
    const { data } = await axios.get("http://localhost:5000/api/users");
    return Array.isArray(data) ? data : [];
};

const deleteUserById = async (userId) => {
    await axios.delete(`http://localhost:5000/api/users/${userId}`);
};

export default function UsersList() {
    const { t } = useTranslation();

    const [editUser, setEditUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);

    const queryClient = useQueryClient();

    // جلب المستخدمين مع React Query
    const { data: users, isLoading, isError, error } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
    });

    // حذف المستخدم
    const deleteMutation = useMutation({
        mutationFn: () => deleteUserById(deleteUser._id),
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]); // إعادة جلب المستخدمين
            setDeleteUser(null);
        },
        onError: (error) => {
            console.error(t("deleteUserError", "حدث خطأ أثناء حذف المستخدم:"), error);
        },
    });

    const handleDeleteConfirm = () => {
        deleteMutation.mutate();
    };

    const handleEdit = (user) => {
        setEditUser(user);
    };

    const handleCancelEdit = () => {
        setEditUser(null);
    };

    if (isLoading) return <p>{t("loading", "جاري التحميل...")}</p>;

    if (isError)
        return (
            <p>
                {t("fetchUsersError", "حدث خطأ أثناء جلب المستخدمين:")}{" "}
                {error.message || ""}
            </p>
        );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{t("usersListTitle", "قائمة المستخدمين")}</h1>

            {/* مودال الحذف */}
            {deleteUser && (
                <ConfirmDeleteModal
                    user={deleteUser}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteUser(null)}
                    loading={deleteMutation.isLoading}
                />
            )}

            {/* نموذج التعديل */}
            {editUser ? (
                <UserEditForm
                    user={editUser}
                    onReload={() => queryClient.invalidateQueries(["users"])}
                    onCancel={handleCancelEdit}
                />
            ) : (
                <UserTable users={users} onEdit={handleEdit} onDelete={setDeleteUser} />
            )}
        </div>
    );
}
