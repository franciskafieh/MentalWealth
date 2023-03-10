/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/Auth/Register": {
    post: {
      requestBody?: {
        content: {
          "application/json": components["schemas"]["RegisterRequest"];
          "text/json": components["schemas"]["RegisterRequest"];
          "application/*+json": components["schemas"]["RegisterRequest"];
        };
      };
      responses: {
        /** @description No Content */
        204: never;
        /** @description Bad Request */
        400: {
          content: {
            "application/json": components["schemas"]["ProblemDetails"];
          };
        };
      };
    };
  };
  "/Auth/Login": {
    post: {
      requestBody?: {
        content: {
          "application/json": components["schemas"]["LoginRequest"];
          "text/json": components["schemas"]["LoginRequest"];
          "application/*+json": components["schemas"]["LoginRequest"];
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            "application/json": components["schemas"]["LoginResponse"];
          };
        };
        /** @description Bad Request */
        400: {
          content: {
            "application/json": components["schemas"]["ProblemDetails"];
          };
        };
      };
    };
  };
  "/Auth/Refresh": {
    post: {
      responses: {
        /** @description Success */
        200: {
          content: {
            "application/json": components["schemas"]["LoginResponse"];
          };
        };
        /** @description Bad Request */
        400: {
          content: {
            "application/json": components["schemas"]["ProblemDetails"];
          };
        };
      };
    };
  };
  "/Auth/Logout": {
    delete: {
      responses: {
        /** @description No Content */
        204: never;
      };
    };
  };
  "/Journals": {
    get: {
      responses: {
        /** @description Success */
        200: {
          content: {
            "application/json": (components["schemas"]["JournalIndexResponse"])[];
          };
        };
      };
    };
    post: {
      requestBody?: {
        content: {
          "application/json": components["schemas"]["JournalCreateRequest"];
          "text/json": components["schemas"]["JournalCreateRequest"];
          "application/*+json": components["schemas"]["JournalCreateRequest"];
        };
      };
      responses: {
        /** @description Created */
        201: {
          content: {
            "application/json": components["schemas"]["JournalViewResponse"];
          };
        };
        /** @description Bad Request */
        400: {
          content: {
            "application/json": components["schemas"]["ProblemDetails"];
          };
        };
      };
    };
  };
  "/Journals/{id}": {
    get: {
      parameters: {
        query?: {
          token?: string;
        };
        path: {
          id: number;
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            "application/json": components["schemas"]["JournalViewResponse"];
          };
        };
        /** @description Not Found */
        404: {
          content: {
            "application/json": components["schemas"]["ProblemDetails"];
          };
        };
      };
    };
    put: {
      parameters: {
        path: {
          id: number;
        };
      };
      requestBody?: {
        content: {
          "application/json": components["schemas"]["JournalUpdateRequest"];
          "text/json": components["schemas"]["JournalUpdateRequest"];
          "application/*+json": components["schemas"]["JournalUpdateRequest"];
        };
      };
      responses: {
        /** @description No Content */
        204: never;
        /** @description Bad Request */
        400: {
          content: {
            "application/json": components["schemas"]["ProblemDetails"];
          };
        };
        /** @description Not Found */
        404: {
          content: {
            "application/json": components["schemas"]["ProblemDetails"];
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          id: number;
        };
      };
      responses: {
        /** @description No Content */
        204: never;
        /** @description Not Found */
        404: {
          content: {
            "application/json": components["schemas"]["ProblemDetails"];
          };
        };
      };
    };
  };
  "/Money": {
    get: {
      responses: {
        /** @description Success */
        200: {
          content: {
            "application/json": components["schemas"]["MoneyViewResponse"];
          };
        };
      };
    };
  };
  "/Share": {
    post: {
      requestBody?: {
        content: {
          "application/json": components["schemas"]["ShareCreateRequest"];
          "text/json": components["schemas"]["ShareCreateRequest"];
          "application/*+json": components["schemas"]["ShareCreateRequest"];
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            "application/json": string;
          };
        };
        /** @description Bad Request */
        400: {
          content: {
            "application/json": components["schemas"]["ProblemDetails"];
          };
        };
      };
    };
  };
  "/User": {
    get: {
      responses: {
        /** @description Success */
        200: {
          content: {
            "application/json": components["schemas"]["UserResponse"];
          };
        };
      };
    };
    delete: {
      responses: {
        /** @description No Content */
        204: never;
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    JournalCreateRequest: {
      title: string;
      /** Format: int32 */
      moodLevel: number;
      content: string;
    };
    JournalIndexResponse: {
      /** Format: int32 */
      id?: number;
      title?: string | null;
      /** Format: int32 */
      moodLevel?: number;
      /** Format: date-time */
      createdAt?: string;
      /** Format: date-time */
      updatedAt?: string;
    };
    JournalUpdateRequest: {
      title: string;
      /** Format: int32 */
      moodLevel: number;
      content: string;
    };
    JournalViewResponse: {
      title?: string | null;
      /** Format: int32 */
      moodLevel?: number;
      content?: string | null;
      /** Format: date-time */
      createdAt?: string;
      /** Format: date-time */
      updatedAt?: string;
    };
    LoginRequest: {
      email?: string | null;
      password?: string | null;
      remember?: boolean;
    };
    LoginResponse: {
      user?: components["schemas"]["LoginResponseUser"];
      token?: string | null;
      /** Format: date-time */
      expiresAt?: string;
    };
    LoginResponseUser: {
      id?: string | null;
      email?: string | null;
      userName?: string | null;
    };
    MoneyViewResponse: {
      /** Format: int32 */
      balance?: number;
    };
    ProblemDetails: {
      type?: string | null;
      title?: string | null;
      /** Format: int32 */
      status?: number | null;
      detail?: string | null;
      instance?: string | null;
      [key: string]: unknown | undefined;
    };
    RegisterRequest: {
      email?: string | null;
      userName?: string | null;
      password?: string | null;
      confirmPassword?: string | null;
    };
    ShareCreateRequest: {
      /** Format: int32 */
      journalEntryId: number;
      recipientId: string;
      /** Format: date-time */
      expiryDate: string;
    };
    UserResponse: {
      id?: string | null;
      email?: string | null;
      userName?: string | null;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type external = Record<string, never>;

export type operations = Record<string, never>;
