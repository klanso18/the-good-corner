import { useUpdateTagMutation } from "@/graphql/generated/schema";
import { Tag } from "@/types";
import {
  CheckCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

interface AdminTagRowProps {
  tag: Tag;
  handleDeleteTag: (id: number) => void;
}

export default function AdminTagRow({
  tag: { id, name },
  handleDeleteTag,
}: AdminTagRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayedName, setDisplayedName] = useState(name);
  const [updateTag] = useUpdateTagMutation();

  const handleSave = async () => {
    try {
      if (displayedName) {
        await updateTag({
          variables: {
            tagId: id,
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
              onClick={() => handleDeleteTag(id)}
            />
          </div>
        )}
      </td>
    </tr>
  );
}
