import { authApi } from "../auth/authApi";

// RTK Query Code Splitting
const recipeApi = authApi.injectEndpoints({
  endpoints: (build) => ({
    getAllRecipes: build.query({
      query: (searchedTerm) => ({
        url: "recipes",
        params: { search: searchedTerm },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Recipes", _id })),
              { type: "Recipes", _id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: ''Recipes'', id: 'LIST' }` is invalidated
            [{ type: "Recipes", _id: "LIST" }],
    }),

    getRecipe: build.query({
      query: (id) => `recipe/${id}`,
      providesTags: (result, error, _id) => [{ type: "Recipes", _id }],
    }),

    updateRecipe: build.mutation({
      query(data) {
        const { _id, ...body } = data;
        return {
          url: `recipe/${_id}`,
          method: "PUT",
          body,
        };
      },
      // Invalidates all queries that subscribe to this Recipe `id` only.
      // In this case, `getRecipe` will be re-run.
      invalidatesTags: (result, error, { _id }) => [{ type: "Recipes", _id }],
    }),

    addRecipe: build.mutation({
      query(body) {
        return {
          url: `recipe`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "Recipes", _id: "LIST" }],
    }),
    getUserRecipes: build.query({
      query: (username) => `recipes/${username}`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllRecipesQuery,
  useGetRecipeQuery,
  useUpdateRecipeMutation,
  useAddRecipeMutation,
  useGetUserRecipesQuery,
} = recipeApi;