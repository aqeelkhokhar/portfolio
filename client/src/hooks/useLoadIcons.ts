import { useEffect, useState } from "react";

const useLoadIcons = () => {
  const [icons, setIcons] = useState<any>({});

  useEffect(() => {
    const loadIcons = async () => {
      const [faIcons, fa6Icons] = await Promise.all([
        import("react-icons/fa"),
        import("react-icons/fa6"),
      ]);
      setIcons({ ...faIcons, ...fa6Icons });
    };

    loadIcons();
  }, []);

  return icons;
};

export default useLoadIcons;
