import { useTranslation } from "react-i18next";
import UserRow from "./UserRow";

export default function UserTable({ users, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <table className="w-full text-right border-separate border-spacing-2">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-center">{t("name")}</th>
          <th className="p-2 text-center">{t("email")}</th>
          <th className="p-2 text-center">{t("role")}</th>
          <th className="p-2 text-center">{t("actions")}</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserRow
            key={user._id}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}
