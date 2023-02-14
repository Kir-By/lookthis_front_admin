import { useCallback, useState } from "react";

const useOpenModal = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  
  const handleIsOpenModal = useCallback(
    (isOpen: boolean) => {
      setIsOpenModal(isOpen);
    },
    [setIsOpenModal]
  );

  return {
    isOpenModal,
    handleIsOpenModal
  };
};

export default useOpenModal;
