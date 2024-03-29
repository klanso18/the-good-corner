import { Category } from "@/types";
import {
  CheckCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useUpdateCategoryMutation } from "@/graphql/generated/schema";

interface AdminCategoryRowProps {
  category: Category;
  handleDeleteCategory: (id: number) => void;
}

export default function AdminCategoryRow({
  category: { id, name },
  handleDeleteCategory,
}: AdminCategoryRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayedName, setDisplayedName] = useState(name);
  const [updateCategory] = useUpdateCategoryMutation();

  const handleSave = async () => {
    try {
      if (displayedName) {
        await updateCategory({
          variables: {
            categoryId: id,
            data: { name: displayedName },
          },
        });
        setIsEditing(false);
      }
    } catch (err) {
      console.log(err);
      setDisplayedName(name);
    }
  };

  return (
    <tr>
      <td>{id}</td>
      <td>
        {isEditing ? (
          <input
            className="input"
            value={displayedName}
            onChange={(e) => setDisplayedName(e.target.value)}
          />
        ) : (
          displayedName
        )}
      </td>
      <td>
        {isEditing ? (
          <div className="flex">
            <CheckCircleIcon
              className="cursor-pointer mr-2"
              width={24}
              height={24}
              onClick={handleSave}
            />
            <XCircleIcon
              className="cursor-pointer"
              width={24}
              height={24}
              onClick={() => {
                setDisplayedName(name);
                setIsEditing(false);
              }}
            />
          </div>
        ) : (
          <div className="flex">
            <PencilSquareIcon
              className="cursor-pointer mr-2"
              width={24}
              height={24}
              onClick={() => setIsEditing(true)}
            />

            <TrashIcon
              className="cursor-pointer"
              width={24}
              height={24}
              onClick={() => handleDeleteCategory(id)}
            />
          </div>
        )}
      </td>
    </tr>
  );
}
