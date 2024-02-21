import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";
export interface CategoryProperties {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  workspace_id: number;
  name: string;
  archived: boolean;
  properties?: [
    {
      ID: number;
      CreatedAt: string;
      UpdatedAt: string;
      DeletedAt: string;
      workspace_id: number;
      category_id: number;
      name: string;
      type: string;
      values: string;
    }
  ];
}
interface CategoryProperty {
  code: number;
  msg: string;
  data: {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string;
    workspace_id: number;
    category_id: number;
    name: string;
    type: string;
    values: string;
  };
}
interface UpdatedPropertyBody {
  name: string;
  type: string;
  values: string;
}
interface UseCategoryProperty {
  workspaceCategoryProperties: CategoryProperties[];
  categoryProperty: CategoryProperty;
  archivedCategoryProperty: ICategoryProperties[];
  getWorkspaceCategoryProperties: (workspaceId: number) => void;
  createWorkspaceCategoryProperties: (propertyValues: any) => Promise<void>;
  updateWorkspaceCategoryProperties: (
    workspaceId: number | undefined,
    workspaceCategoryId: number | undefined,
    workspaceCategoryPropertyId: number | undefined,
    updatedPropertyBody: UpdatedPropertyBody
  ) => Promise<boolean | undefined>;
  archiveWorkspaceCategoryProperties: (
    workspaceId: number | undefined,
    workspaceCategoryId: number | undefined,
    workspaceCategoryPropertyId: string | undefined
  ) => Promise<boolean | undefined>;
  getCategoryPropertyByCategoryId: (
    workspaceId: number,
    categoryId: number,
    archive?: boolean
  ) => Promise<boolean | undefined>;
  unArchiveCategoryProperties: (
    workspaceId: number | undefined,
    workspaceCategoryId: number | undefined,
    workspaceCategoryPropertyId: number[] | undefined
  ) => Promise<boolean | undefined>;
}

export const useCategoryProperty = create<UseCategoryProperty>((set) => {
  const { setLoading } = useLoading.getState();
  return {
    workspaceCategoryProperties: [],
    categoryProperty: {
      code: 0,
      msg: "",
      data: {
        ID: 0,
        CreatedAt: "",
        UpdatedAt: "",
        DeletedAt: "",
        workspace_id: 0,
        category_id: 0,
        name: "",
        type: "",
        values: "",
      },
    },
    archivedCategoryProperty: [],
    getWorkspaceCategoryProperties: async (workspaceId) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/workspace_categories/category_and_property_by_workspace_id/${workspaceId}`
        );
        set({ workspaceCategoryProperties: data.data });
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    createWorkspaceCategoryProperties: async (propertyValues) => {
      const { category_id, name, type, values, workspace_id } = propertyValues;
      try {
        setLoading(true);
        const { data } = await axiosClient.post(
          `/workspace_category_property`,
          {
            category_id,
            name,
            type,
            values,
            workspace_id,
          }
        );
        set({ categoryProperty: data });
        toast.success("Property created successfully");
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    updateWorkspaceCategoryProperties: async (
      workspaceId,
      workspaceCategoryId,
      workspaceCategoryPropertyId,
      updatedPropertyBody
    ) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.put(
          `/workspace_category_property/${workspaceId}/${workspaceCategoryId}/update/${workspaceCategoryPropertyId}`,
          updatedPropertyBody
        );
        set({ categoryProperty: data });
        toast.success("Property updated successfully");
        return true;
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    // archive property
    archiveWorkspaceCategoryProperties: async (
      workspaceId,
      workspaceCategoryId,
      workspaceCategoryPropertyId
    ) => {
      try {
        setLoading(true);
        await axiosClient.put(
          `/workspace_category_property/${workspaceId}/${workspaceCategoryId}/archive?ids=${workspaceCategoryPropertyId}`
        );
        toast.success("Archived successfully");
        return true;
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    // get archive category property list
    getCategoryPropertyByCategoryId: async (
      workspaceId,
      categoryId,
      archive
    ) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/workspace_category_properties/category_properties_by_workspace_id_and_category_id/${workspaceId}/${categoryId}?archived=${archive}`
        );
        set({ archivedCategoryProperty: data.data.rows });
        return true;
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    // un-archive property
    unArchiveCategoryProperties: async (
      workspaceId,
      workspaceCategoryId,
      workspaceCategoryPropertyId
    ) => {
      try {
        setLoading(true);
        await axiosClient.put(
          `/workspace_category_property/${workspaceId}/${workspaceCategoryId}/unarchive?ids=${workspaceCategoryPropertyId}`
        );
        toast.success("Un-Archived successfully");
        return true;
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
