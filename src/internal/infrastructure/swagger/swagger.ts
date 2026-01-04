import { createDocument } from "zod-openapi";

export const document = createDocument({
  openapi: "3.1.0",
  info: {
    title: "Orders API",
    description: "API para gerenciamento de usuários e pedidos",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:8080/v1",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/v1/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Create a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "user@example.com",
                  },
                  password: {
                    type: "string",
                    minLength: 6,
                    example: "password123",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User created successfully",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Email already exists",
          },
        },
      },
    },
    "/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "user@example.com",
                  },
                  password: {
                    type: "string",
                    example: "password123",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
          },
        },
      },
    },
    "/v1/orders": {
      post: {
        tags: ["Orders"],
        summary: "Create a new order",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["lab", "patient", "customer", "services"],
                properties: {
                  lab: {
                    type: "string",
                    example: "Lab Name",
                  },
                  patient: {
                    type: "string",
                    example: "Patient Name",
                  },
                  customer: {
                    type: "string",
                    example: "Customer Name",
                  },
                  services: {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "object",
                      required: ["name", "value"],
                      properties: {
                        name: {
                          type: "string",
                          example: "Blood Test",
                        },
                        value: {
                          type: "number",
                          example: 50.0,
                        },
                        status: {
                          type: "string",
                          enum: ["PENDING", "COMPLETED"],
                          example: "PENDING",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Order created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Order created successfully",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid request body",
          },
          "401": {
            description: "Unauthorized",
          },
        },
      },
      get: {
        tags: ["Orders"],
        summary: "Get all orders with pagination",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              default: 1,
              example: 1,
            },
            description: "Page number",
          },
          {
            name: "rowPerPage",
            in: "query",
            schema: {
              type: "integer",
              default: 10,
              example: 10,
            },
            description: "Number of rows per page",
          },
          {
            name: "state",
            in: "query",
            schema: {
              type: "string",
              enum: ["CREATED", "ANALYSIS", "COMPLETED"],
              example: "CREATED",
            },
            description: "Filter by order state (optional)",
          },
        ],
        responses: {
          "200": {
            description: "Orders retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    page: {
                      type: "integer",
                      example: 1,
                    },
                    rowPerPage: {
                      type: "integer",
                      example: 10,
                    },
                    total: {
                      type: "integer",
                      example: 20,
                    },
                    orders: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            example: "507f1f77bcf86cd799439011",
                          },
                          lab: {
                            type: "string",
                            example: "Lab Name",
                          },
                          patient: {
                            type: "string",
                            example: "Patient Name",
                          },
                          customer: {
                            type: "string",
                            example: "Customer Name",
                          },
                          state: {
                            type: "string",
                            enum: ["CREATED", "ANALYSIS", "COMPLETED"],
                            example: "CREATED",
                          },
                          status: {
                            type: "string",
                            enum: ["ACTIVE", "DELETED"],
                            example: "ACTIVE",
                          },
                          services: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                name: {
                                  type: "string",
                                  example: "Blood Test",
                                },
                                value: {
                                  type: "number",
                                  example: 50.0,
                                },
                                status: {
                                  type: "string",
                                  enum: ["PENDING", "COMPLETED"],
                                  example: "PENDING",
                                },
                              },
                            },
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-01-04T10:30:00Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-01-04T10:30:00Z",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
          },
        },
      },
    },
    "/v1/orders/{id}/advance": {
      patch: {
        tags: ["Orders"],
        summary: "Advance order status to next state",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            description: "Order ID",
          },
        ],
        responses: {
          "200": {
            description: "Order status advanced successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      example: "507f1f77bcf86cd799439011",
                    },
                    lab: {
                      type: "string",
                      example: "Lab Name",
                    },
                    patient: {
                      type: "string",
                      example: "Patient Name",
                    },
                    customer: {
                      type: "string",
                      example: "Customer Name",
                    },
                    state: {
                      type: "string",
                      enum: ["CREATED", "ANALYSIS", "COMPLETED"],
                      example: "ANALYSIS",
                    },
                    status: {
                      type: "string",
                      enum: ["ACTIVE", "DELETED"],
                      example: "ACTIVE",
                    },
                    services: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                          },
                          value: {
                            type: "number",
                          },
                          status: {
                            type: "string",
                            enum: ["PENDING", "COMPLETED"],
                          },
                        },
                      },
                    },
                    createdAt: {
                      type: "string",
                      format: "date-time",
                    },
                    updatedAt: {
                      type: "string",
                      format: "date-time",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Order cannot be updated (already completed)",
          },
          "401": {
            description: "Unauthorized",
          },
          "404": {
            description: "Order not found",
          },
        },
      },
    },
  },
});