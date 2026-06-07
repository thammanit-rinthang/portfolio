type ProviderHealthConfig = {
  groqEnabled: boolean;
  groqApiKey?: string;
  openrouterEnabled: boolean;
  openrouterApiKey?: string;
};

export function createProviderHealthSnapshot(
  priority: string[],
  config: ProviderHealthConfig,
) {
  return priority.map((name, index) => {
    let available = false;

    if (name === "groq") {
      available = config.groqEnabled && Boolean(config.groqApiKey);
    } else if (name === "openrouter") {
      available = config.openrouterEnabled && Boolean(config.openrouterApiKey);
    }

    return {
      name,
      available,
      priority: index + 1,
    };
  });
}
