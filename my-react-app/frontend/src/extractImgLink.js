String.prototype.isMatch = function(s){
    return this.match(s)!==null 
 }

const isImageUrlDetect = (text) =>{
    const match = text.isMatch("https")

    if(match){
        return true
    }
    return false
}

const extractImageAndText = (text) => {
  const regex = /!\[.*?\]\((https?:\/\/[^\s]+)\)/g; // Global regex to match markdown images
  const content = [];
  let lastIndex = 0;

  // Find all image matches
  text.replace(regex, (match, imageUrl, offset) => {
      // Add text before the image
      if (offset > lastIndex) {
          content.push({
              type: 'text',
              value: text.slice(lastIndex, offset).trim(),
          });
      }

      // Add the image
      content.push({
          type: 'image',
          value: imageUrl,
      });

      // Update the lastIndex to the end of the current match
      lastIndex = offset + match.length;
  });

  // Add any remaining text after the last image
  if (lastIndex < text.length) {
      content.push({
          type: 'text',
          value: text.slice(lastIndex).trim(),
      });
  }

  return content;
};

const extractTextOnly = (text) => {
  const regex = /!\[.*?\]\((https?:\/\/[^\s]+)\)/g; // Global regex to match all image URLs
  const textWithoutImages = text.replace(regex, '').trim(); // Remove image markdown
  return { description: textWithoutImages };
};

export { isImageUrlDetect, extractImageAndText, extractTextOnly };
