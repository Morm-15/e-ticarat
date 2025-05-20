import { useState, useEffect } from 'react';

export default function UserDeleteModal({ user, onConfirm, onCancel }) {
    const [inputName, setInputName] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [error, setError] = useState('');

    // إنشاء رمز مكون من 4 أرقام عشوائية عند فتح المودال
    useEffect(() => {
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedCode(code);
    }, []);

    const handleConfirm = () => {
        setError('');
        // التحقق من الاسم والرمز
        if (inputName !== user.name) {
            setError('اسم المستخدم غير صحيح');
            return;
        }
        if (inputCode !== generatedCode) {
            setError('الرمز غير صحيح');
            return;
        }
        onConfirm();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">تأكيد حذف المستخدم</h2>
                <p className="mb-4">للحذف، يرجى إدخال اسم المستخدم والرمز التالي:</p>
                <p className="mb-4 font-mono text-lg bg-gray-200 p-2 text-center rounded">{generatedCode}</p>

                <input
                    type="text"
                    placeholder="أدخل اسم المستخدم"
                    className="border p-2 mb-3 w-full rounded"
                    value={inputName}
                    onChange={e => setInputName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="أدخل الرمز المكون من 4 خانات"
                    className="border p-2 mb-3 w-full rounded"
                    value={inputCode}
                    onChange={e => setInputCode(e.target.value)}
                    maxLength={4}
                />

                {error && <p className="text-red-600 mb-3">{error}</p>}

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        تأكيد الحذف
                    </button>
                </div>
            </div>
        </div>
    );
}
