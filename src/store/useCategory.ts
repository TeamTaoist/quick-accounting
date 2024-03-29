import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";

interface WorkspaceCategory {
  archived: boolean;
  CreatedAt: string;
  DeletedAt: {
    time: string;
    valid: boolean;
  };
  ID: number;
  name: string;
  UpdatedAt: string;
  workspace_id: number;
}
interface WorkspaceCategories {
  code: number;
  msg: string;
  data: {
    page: number;
    rows: [
      {
        CreatedAt: string;
        DeleteAt: {
          time: string;
          valid: string;
        };
        ID: number;
        UpdatedAt: string;
        archived: boolean;
        name: string;
        workspace_id: number;
      }
    ];
    size: number;
    total: number;
  };
}
interface CreateCategoryForm {
  name: string;
  workspace_id: number;
}

interface UseCategory {
  workspaceCategories: WorkspaceCategories;
  workspaceCategory: WorkspaceCategory;
  getWorkspaceCategories: (workspaceId: number, archiveQuery?: boolean) => void;
  createWorkspaceCategory: (
    createCategoryFormData: CreateCategoryForm
  ) => Promise<void>;
  getWorkspaceCategoryDetails: (workspaceCategoryId: number) => void;
  updateCategoryName: (
    workspaceId: number,
    categoryId: number,
    categoryName: string | undefined
  ) => Promise<void>;
  updateCategoryArchive: (
    workspaceId: number,
    categoryIds: number
  ) => Promise<void>;
  unArchiveCategory: (
    workspaceId: number,
    categoryIds: number[]
  ) => Promise<void>;
}

export const useCategory = create<UseCategory>((set) => {
  const { setLoading } = useLoading.getState();
  return {
    workspaceCategories: {
      code: 0,
      msg: "",
      data: {
        page: 0,
        rows: [
          {
            CreatedAt: "",
            DeleteAt: {
              time: "",
              valid: "",
            },
            ID: 0,
            UpdatedAt: "",
            archived: false,
            name: "",
            workspace_id: 0,
          },
        ],
        size: 0,
        total: 0,
      },
    },
    workspaceCategory: {
      archived: false,
      CreatedAt: "",
      DeletedAt: {
        time: "",
        valid: false,
      },
      ID: 0,
      name: "",
      UpdatedAt: "",
      workspace_id: 0,
    },
    getWorkspaceCategories: async (workspaceId, archiveQuery) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/workspace_categories/categories_by_workspace_id/${workspaceId}?archived=${archiveQuery}`
        );
        set({ workspaceCategories: data });
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    // create new workspace category
    createWorkspaceCategory: async (createCategoryFormData) => {
      const { name, workspace_id } = createCategoryFormData;
      try {
        setLoading(true);
        const { data } = await axiosClient.post(`/workspace_category`, {
          name,
          workspace_id,
        });
        set({ workspaceCategory: data.data });
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    // get workspace category details
    getWorkspaceCategoryDetails: async (workspaceCategoryId) => {
      try {
        const { data } = await axiosClient.get(
          `/workspace_category/${workspaceCategoryId}`
        );
        set({ workspaceCategory: data.data });
      } catch (error: any) {
        console.log(error);
      } finally {
      }
    },
    // update workspace category name
    updateCategoryName: async (workspaceId, categoryId, categoryName) => {
      try {
        const { data } = await axiosClient.put(
          `/workspace_category/${workspaceId}/update/${categoryId}`,
          { name: categoryName }
        );
        if (data.msg === "success" && data.code === 200) {
          toast("Category name updated");
        }
      } catch (error: any) {
        console.log(error);
        toast.error(error?.data.msg || error?.status || error);
      } finally {
      }
    },
    // update workspace category archive
    updateCategoryArchive: async (workspaceId, categoryIds) => {
      try {
        const { data } = await axiosClient.put(
          `/workspace_category/${workspaceId}/archive?ids=${categoryIds}`
        );
        if (data.msg === "success" && data.code === 200) {
          toast("Archive updated successfully");
        }
      } catch (error: any) {
        console.log(error);
      } finally {
      }
    },
    // un-archive workspace category
    unArchiveCategory: async (workspaceId, categoryIds) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.put(
          `/workspace_category/${workspaceId}/unarchive?ids=${categoryIds}`
        );
        if (data.msg === "success" && data.code === 200) {
          toast("Archive updated successfully");
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
