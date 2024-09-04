import { useState, useCallback } from "react";

const useHashtags = (initialHashtags = []) => {
  const [hashtags, setHashtags] = useState(initialHashtags);
  const [hashtagInput, setHashtagInput] = useState("");

  const handleHashtagInputChange = useCallback((e) => {
    setHashtagInput(e.target.value);
  }, []);

  const addHashtag = useCallback(() => {
    const trimmedInput = hashtagInput.trim();
    if (trimmedInput) {
      const newTags = trimmedInput
        .split(/\s+/)
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));

      setHashtags((prevTags) => {
        const uniqueNewTags = newTags.filter((tag) => !prevTags.includes(tag));
        return [...prevTags, ...uniqueNewTags];
      });
      setHashtagInput("");
    }
  }, [hashtagInput]);

  const handleHashtagInputKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.altKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        addHashtag();
      }
    },
    [addHashtag]
  );

  const removeHashtag = useCallback((tag) => {
    setHashtags((prevHashtags) => prevHashtags.filter((t) => t !== tag));
  }, []);

  return {
    hashtags,
    hashtagInput,
    setHashtagInput,
    handleHashtagInputChange,
    handleHashtagInputKeyDown,
    addHashtag,
    removeHashtag,
  };
};

export default useHashtags;
