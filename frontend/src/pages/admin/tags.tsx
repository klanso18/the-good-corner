import AdminLayout from "@/components/admin/AdminLayout";
import AdminTagRow from "@/components/admin/AdminTagRow";
import {
  useCreateTagMutation,
  useDeleteTagMutation,
  useGetTagsQuery,
} from "@/graphql/generated/schema";

export default function AdminTags() {
  const { data: tagData, refetch: refetchTags } = useGetTagsQuery();
  const tags = tagData?.tags || [];
  const [createTag] = useCreateTagMutation();
  const [deleteTag] = useDeleteTagMutation();

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const form = e.target as HTMLFormElement;
  //   const formData = new FormData(e.target as HTMLFormElement);
  //   const formJSON = Object.fromEntries(formData.entries());

  //   createTag({
  //     variables: {
  //       data: formJSON as any,
  //     },
  //   })
  //     .then(() => {
  //       refetchTags();
  //       form.reset();
  //     })
  //     .catch(console.error);
  // };

  const handleDeleteTag = (id: number) => {
    if (confirm("Êtes-vous certains de vouloir supprimer ce tag ?"))
      deleteTag({
        variables: { tagId: id },
      })
        .then(() => {
          refetchTags();
        })
        .catch(console.error);
  };

  return (
    <AdminLayout title="Gestion des tags">
      <form action="">
        <label htmlFor="name">
          Nouveau tag :
          <input type="text" name="name" id="name" className="input" required />
        </label>
        <button className="btn">Enregistrer</button>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <AdminTagRow
              tag={tag}
              key={tag.id}
              handleDeleteTag={handleDeleteTag}
            />
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
