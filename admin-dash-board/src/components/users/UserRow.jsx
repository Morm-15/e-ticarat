import { FaEdit, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function UserRow({ user, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <tr className="border-b">
      <td className="p-4 text-center">{user.name}</td>
      <td className="p-4 text-center">{user.email}</td>
      <td className="p-4 text-center">{user.role}</td>
      <td className="p-4 text-center">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onEdit(user)}
            className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            <FaEdit className="mr-2" />
            <span>{t("edit")}</span>
          </button>
          <button
            onClick={() => onDelete(user)}
            className="flex items-center text-red-600 hover:text-red-800 focus:outline-none"
          >
            <FaTrash className="mr-2" />
            <span>{t("delete")}</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
