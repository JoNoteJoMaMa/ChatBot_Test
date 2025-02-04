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
    const regex = /!\[.*?\]\((https?:\/\/[^\s]+)\)\s*([\s\S]*)/; // Matches markdown image syntax and captures the entire description
    const match = text.match(regex);
  
    if (match) {
      return {
        imageUrl: match[1], // Extracted URL
        description: match[2].trim(), // Extracted description
      };
    }
  
    return {
      imageUrl: null,
      description: text.trim(), // If no URL, return the entire text as description
    };
  };

export { isImageUrlDetect, extractImageAndText };
