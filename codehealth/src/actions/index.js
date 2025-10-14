"use server";

export async function explain(prevState, formData) {
  const code = formData.get("code");
  const language = formData.get("language");
  console.log(`Generating explanation for ${language}`);

  try {
    const res = await fetch(`http://localhost:3002/api/explain-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Failed to fetch the results (status: ${res.status})`,
      };
    }

    const data = await res.json();

    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: `An Error Occurred: ${err?.message}`,
    };
  }
}
