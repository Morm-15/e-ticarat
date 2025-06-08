import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function UserEditForm({ user, onCancel, onReload }) {
    const { t } = useTranslation();

    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const [role, setRole] = useState(user.role || "user");
    const [isActive, setIsActive] = useState(user.isActive ?? true);
    const [successMessage, setSuccessMessage] = useState("");

    // تعريف عملية التعديل كميوتاشن باستخدام React Query
    const updateUserMutation = useMutation({
        mutationFn: async (updatedUser) => {
            return await axios.put(
                `http://localhost:5000/api/users/${user._id}`,
                updatedUser
            );
        },
        onSuccess: () => {
            setSuccessMessage(t("userUpdatedSuccess", "تم تعديل المستخدم بنجاح ✔️"));
            setTimeout(() => {
                setSuccessMessage("");
                onReload?.();
                onCancel?.();
            }, 1500);
        },
        onError: (error) => {
            console.error(
                t("updateUserError", "حدث خطأ أثناء تعديل المستخدم:"),
                error
            );
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedUser = { name, email, role, isActive };
        updateUserMutation.mutate(updatedUser);
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">
                {t("editUser", "تعديل المستخدم")}
            </h2>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg border border-green-300">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">{t("name", "الاسم")}</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        required
                        disabled={updateUserMutation.isLoading}
                    />
                </div>
                <div>
                    <label className="block text-gray-700">
                        {t("email", "البريد الإلكتروني")}
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        required
                        disabled={updateUserMutation.isLoading}
                    />
                </div>
                <div>
                    <label className="block text-gray-700">{t("role", "الدور")}</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        disabled={updateUserMutation.isLoading}
                    >
                        <option value="admin">{t("admin", "مدير")}</option>
                        <option value="user">{t("user", "مستخدم")}</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">{t("status", "الحالة")}</label>
                    <select
                        value={isActive.toString()}
                        onChange={(e) => setIsActive(e.target.value === "true")}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        disabled={updateUserMutation.isLoading}
                    >
                        <option value="true">{t("active", "مفعل")}</option>
                        <option value="false">{t("inactive", "غير مفعل")}</option>
                    </select>
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-all duration-200"
                        disabled={updateUserMutation.isLoading}
                    >
                        {t("cancel", "إلغاء")}
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-200"
                        disabled={updateUserMutation.isLoading}
                    >
                        {updateUserMutation.isLoading
                            ? t("saving", "جارٍ الحفظ...")
                            : t("saveChanges", "حفظ التعديلات")}
                    </button>
                </div>
            </form>
        </div>
    );
}
