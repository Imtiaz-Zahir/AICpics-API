

export async function getMedia(imageUrl: string) {
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      const responseText = await imageResponse.text();
      if (responseText !== "This content is no longer available.") {
        throw new Error(`Failed to fetch image: ${responseText}`);
      }

      return null;
    }
    
    if (!imageResponse.body) throw new Error(`Failed to fetch image`);

    const reader = imageResponse.body.getReader();
    const stream = new ReadableStream({
      start(controller) {
        function push() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            push();
          });
        }

        push();
      }
    });

    const buffer = await new Response(stream).arrayBuffer();
    return buffer;
}
