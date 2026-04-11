import _ from "lodash";
import type { RouteConfigType, RouteConfigsType, RouteItemType } from "@/types"
import type { SettingsConfigType } from "@/settings/context/SettingsContext";
import type { User } from "@/auth/user";
import EventEmitter from "./eventEmitter";

const shadcnColors: Record<string, Record<string, string>> = {
  red: { 400: "#ef5350", 500: "#f44336" },
  pink: { 400: "#ec407a", 500: "#e91e63" },
  purple: { 400: "#ab47bc", 500: "#9c27b0" },
  deepPurple: { 400: "#7e57c2", 500: "#673ab7" },
  indigo: { 400: "#5c6bc0", 500: "#3f51b5" },
  blue: { 400: "#42a5f5", 500: "#2196f3" },
  lightBlue: { 400: "#29b6f6", 500: "#03a9f4" },
  cyan: { 400: "#26c6da", 500: "#00bcd4" },
  teal: { 400: "#26a69a", 500: "#009688" },
  green: { 400: "#66bb6a", 500: "#4caf50" },
  lightGreen: { 400: "#9ccc65", 500: "#8bc34a" },
  lime: { 400: "#d4e157", 500: "#cddc39" },
  yellow: { 400: "#ffee58", 500: "#ffeb3b" },
  amber: { 400: "#ffca28", 500: "#ffc107" },
  orange: { 400: "#ffa726", 500: "#ff9800" },
  deepOrange: { 400: "#ff7043", 500: "#ff5722" },
};

type TreeNode = {
  id: string;
  children?: TreeNode[];
};

type hueTypes =
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "A100"
  | "A200"
  | "A400"
  | "A700";

class Utils {
  /**
   * The filterArrayByString function filters an array of objects by a search string.
   * It takes in an array of objects and a search string as parameters and returns a filtered array of objects.
   *
   */

  static filterArrayByString<T>(mainArr: T[], searchText: string): T[] {
    if (!searchText || searchText?.length === 0 || !searchText) {
      return mainArr // Return the original array
    }

    searchText = searchText?.toLowerCase()
    const filtered = mainArr.filter((itemObj) =>
      this.searchInObj(itemObj, searchText)
    )

    if (filtered.length === mainArr.length) {
      return mainArr // If the filtered array is identical, return the original
    }

    return filtered
  }

  static filterArrayByString2<T>(mainArr: T[], searchText: string): T[] {
    if (typeof searchText !== "string" || searchText === "") {
      return mainArr
    }

    searchText = searchText?.toLowerCase()

    return mainArr.filter((itemObj: unknown) =>
      this.searchInObj(itemObj, searchText)
    )
  }

  /**
   * The searchInObj function searches an object for a given search string.
   * It takes in an object and a search string as parameters and returns a boolean indicating whether the search string was found in the object.
   *
   */
  static searchInObj(itemObj: unknown, searchText: string) {
    if (!isRecord(itemObj)) {
      return false
    }

    const propArray = Object.keys(itemObj)

    function isRecord(value: unknown): value is Record<string, unknown> {
      return Boolean(
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        typeof value !== "function"
      )
    }

    for (const prop of propArray) {
      const value = itemObj[prop]

      if (typeof value === "string") {
        if (this.searchInString(value, searchText)) {
          return true
        }
      } else if (Array.isArray(value)) {
        if (this.searchInArray(value, searchText)) {
          return true
        }
      }

      if (typeof value === "object") {
        if (this.searchInObj(value, searchText)) {
          return true
        }
      }
    }
    return false
  }

  /**
   * The searchInArray function searches an array for a given search string.
   * It takes in an array and a search string as parameters and returns a boolean indicating whether the search string was found in the array.
   *
   */
  static searchInArray(arr: unknown[], searchText: string) {
    arr.forEach((value) => {
      if (typeof value === "string") {
        if (this.searchInString(value, searchText)) {
          return true
        }
      }

      if (value && typeof value === "object") {
        if (this.searchInObj(value, searchText)) {
          return true
        }
      }

      return false
    })
    return false
  }

  /**
   * The searchInString function searches a string for a given search string.
   * It takes in a string and a search string as parameters and returns a boolean indicating whether the search string was found in the string.
   *
   */
  static searchInString(value: string, searchText: string) {
    return value.toLowerCase().includes(searchText)
  }

  /**
   * The generateGUID function generates a globally unique identifier.
   * It returns a string representing the GUID.
   *
   */
  static generateGUID(): string {
    function S4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }

    return S4() + S4()
  }

  /**
   * The toggleInArray function toggles an item in an array.
   */
  static toggleInArray(item: unknown, array: unknown[]) {
    if (array.indexOf(item) === -1) {
      array.push(item)
    } else {
      array.splice(array.indexOf(item), 1)
    }
  }

  /**
   * The handleize function converts a string to a handle.
   */
  static handleize(text: string) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/\W+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, "") // Trim - from end of text
  }

  /**
   * The setRoutes function sets the routes for the project.
   */
  static setRoutes(
    config: RouteConfigType,
    defaultAuth: SettingsConfigType["defaultAuth"] = undefined
  ): RouteItemType[] {
    let routes: RouteItemType[] = []

    if (config?.routes) {
      routes = [...config.routes]
    }

    const applyAuth = (route: RouteItemType, parentAuth: string[] | null) => {
      const auth = route.auth || route.auth === null ? route.auth : parentAuth
      const settings = _.merge({}, config.settings, route.settings)

      const newRoute = {
        ...route,
        settings,
        auth,
      }

      if (route.children) {
        newRoute.children = route.children.map((childRoute) =>
          applyAuth(childRoute, auth)
        )
      }

      return newRoute
    }

    routes = routes.map((route) => {
      const auth =
        config.auth || config.auth === null ? config.auth : defaultAuth || null
      return applyAuth(route, auth)
    }) as RouteItemType[]

    return [...routes]
  }

  /**
   * The generateRoutesFromConfigs function generates routes from a set of route configurations.
   * It takes in an array of route configurations as a parameter and returns an array of routes.
   *
   */
  static generateRoutesFromConfigs(
    configs: RouteConfigsType,
    defaultAuth: SettingsConfigType["defaultAuth"]
  ) {
    let allRoutes: RouteItemType[] = []
    configs.forEach((config: RouteConfigType) => {
      allRoutes = [...allRoutes, ...this.setRoutes(config, defaultAuth)]
    })
    return allRoutes
  }

  /**
   * The findById function finds an object by its id.
   */
  static findById(tree: TreeNode[], idToFind: string): TreeNode | undefined {
    // Try to find the node at the current level
    const node = _.find(tree, { id: idToFind })

    if (node) {
      return node
    }

    let foundNode: TreeNode | undefined

    // If not found, search in the children using lodash's some for iteration
    _.some(tree, (item) => {
      if (item.children) {
        foundNode = this.findById(item.children, idToFind)
        return foundNode // If foundNode is truthy, _.some will stop iterating
      }

      return false // Continue iterating
    })

    return foundNode
  }

  /**
   * The randomMatColor function generates a random material color.
   */
  static randomMatColor(hue: hueTypes = "400") {
    const mainColors = [
      "red",
      "pink",
      "purple",
      "deepPurple",
      "indigo",
      "blue",
      "lightBlue",
      "cyan",
      "teal",
      "green",
      "lightGreen",
      "lime",
      "yellow",
      "amber",
      "orange",
      "deepOrange",
    ]

    const randomColor =
      mainColors[Math.floor(Math.random() * mainColors.length)]

    return shadcnColors[randomColor][hue]
  }

  /**
   * The findNavItemById function finds a navigation item by its id.
   */
  static difference(
    object: Record<string, unknown>,
    base: Record<string, unknown>
  ): Record<string, unknown> {
    function changes(
      _object: Record<string, unknown>,
      _base: Record<string, unknown>
    ): Record<string, unknown> {
      return _.transform(
        _object,
        (result: Record<string, unknown>, value: unknown, key: string) => {
          if (!_.isEqual(value, _base[key])) {
            result[key] =
              _.isObject(value) && _.isObject(_base[key])
                ? changes(
                    value as Record<string, unknown>,
                    _base[key] as Record<string, unknown>
                  )
                : value
          }
        },
        {}
      )
    }

    return changes(object, base)
  }

  /**
   * The EventEmitter class is a custom implementation of an event emitter.
   * It provides methods for registering and emitting events.
   */
  static EventEmitter = EventEmitter

  /**
   * The hasPermission function checks if a user has permission to access a resource.
   */
  static hasPermission(
    authArr: string[] | string | undefined,
    userRole: User["permissions"]["role_name"]
  ): boolean {
    /**
     * If auth array is not defined
     * Pass and allow
     */
    if (authArr === null || authArr === undefined) {
      return true
    }

    if (Array.isArray(authArr) && authArr?.length === 0) {
      /**
       * if auth array is empty means,
       * allow only user role is guest (null or empty[])
       */
      return (
        !userRole ||
        (Array.isArray(userRole) && userRole.length === 0) ||
        (typeof userRole === "string" && userRole.length === 0)
      )
    }

    /**
     * Check if user has grants
     */
    /*
            Check if user role is array,
            */
    if (userRole && Array.isArray(authArr) && Array.isArray(userRole)) {
      return authArr.some((r: string) => userRole.indexOf(r) >= 0)
    }

    if (typeof userRole === "string" && Array.isArray(authArr)) {
      return authArr?.includes?.(userRole)
    }

    return false
  }

  /**
   * The filterArrayByString function filters an array of objects by a search string.
   */
  static filterRecursive(
    data: [] | null,
    predicate: (arg0: unknown) => boolean
  ) {
    // if no data is sent in, return null, otherwise transform the data
    return !data
      ? null
      : data.reduce((list: unknown[], entry: { children?: [] }) => {
          let clone: unknown = null

          if (predicate(entry)) {
            // if the object matches the filter, clone it as it is
            clone = { ...entry }
          }

          if (entry.children != null) {
            // if the object has childrens, filter the list of children
            const children = this.filterRecursive(entry.children, predicate)

            if (children && children?.length > 0) {
              // if any of the children matches, clone the parent object, overwrite
              // the children list with the filtered list
              clone = { ...entry, children }
            }
          }

          // if there's a cloned object, push it to the output list
          if (clone) {
            list.push(clone)
          }

          return list
        }, [])
  }
}

export default Utils;
