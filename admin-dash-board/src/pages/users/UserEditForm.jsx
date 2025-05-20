import { useState } from 'react';
import axios from 'axios';

export default function UserEditForm({ user, onSubmit, onCancel, onReload }) {
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [role, setRole] = useState(user.role || 'user');
    const [isActive, setIsActive] = useState(user.isActive ?? true);
    const [successMessage, setSuccessMessage] = useState('');
    const [loadingSave, setLoadingSave] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSave(true);
        const updatedUser = { name, email, role, isActive };

        try {
            await axios.put(`http://localhost:5000/api/users/${user._id}`, updatedUser);
            setSuccessMessage('تم تعديل المستخدم بنجاح ✔️');

            // ✅ بعد ظهور الرسالة، نقوم بالتحديث ثم الإغلاق
            setTimeout(() => {
                setSuccessMessage('');
                onReload?.();   // ⬅️ تحديث قائمة المستخدمين
                onCancel?.();   // ⬅️ إغلاق النموذج
            }, 1500);
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setLoadingSave(false);
        }
    };


    return (
        <div className="p-4 bg-white shadow-md rounded-lg max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">تعديل المستخدم</h2>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg border border-green-300">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">الاسم</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        required
                        disabled={loadingSave}
                    />
                </div>
                <div>
                    <label className="block text-gray-700">البريد الإلكتروني</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        required
                        disabled={loadingSave}
                    />
                </div>
                <div>
                    <label className="block text-gray-700">الدور</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        disabled={loadingSave}
                    >
                        <option value="admin">مدير</option>
                        <option value="user">مستخدم</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">الحالة</label>
                    <select
                        value={isActive.toString()}
                        onChange={(e) => setIsActive(e.target.value === 'true')}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        disabled={loadingSave}
                    >
                        <option value="true">مفعل</option>
                        <option value="false">غير مفعل</option>
                    </select>
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-all duration-200"
                        disabled={loadingSave}
                    >
                        إلغاء
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-200"
                        disabled={loadingSave}
                    >
                        {loadingSave ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
                    </button>
                </div>
            </form>
        </div>
    );
}
