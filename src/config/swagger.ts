import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Medical Project API",
      version: "1.0.0",
      description: "API for medical project with OpenAI integration",
      contact: {
        name: "Medical Project Team",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          required: ["patientInfo"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "User ID",
            },
            beforeImage: {
              type: "string",
              description: "Before image URL",
            },
            afterImage: {
              type: "string",
              description: "After image URL",
            },
            patientInfo: {
              type: "string",
              description:
                "Patient biographical and medical history information",
            },
            chatGptText: {
              type: "string",
              description: "AI-generated medical analysis",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        CreateUserRequest: {
          type: "object",
          required: ["patientInfo", "beforeImage", "afterImage"],
          properties: {
            patientInfo: {
              type: "string",
              description:
                "Patient biographical and medical history information",
            },
            beforeImage: {
              type: "string",
              format: "binary",
              description: "Before treatment image",
            },
            afterImage: {
              type: "string",
              format: "binary",
              description: "After treatment image",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
          },
        },
        OpenAITestRequest: {
          type: "object",
          required: ["input"],
          properties: {
            input: {
              type: "string",
              description: "Input text for OpenAI analysis",
            },
          },
        },
        OpenAITestResponse: {
          type: "object",
          properties: {
            response: {
              type: "string",
              description: "OpenAI generated response",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Medical Project API Documentation",
    }),
  );
};
