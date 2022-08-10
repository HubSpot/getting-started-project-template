// Context types
interface PropertiesToSend {
  firstname: String;
}

interface Context {
  propertiesToSend: PropertiesToSend;
}

// Function Response types
interface FunctionResponse {
  sections?: Array<object>;
  message?: { type: string; body: string };
}
