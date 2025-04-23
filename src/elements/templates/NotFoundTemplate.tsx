import NotFoundImage from "@asset/images/notfound.png";
import { Flex, Image } from "@mantine/core";

const NotFoundTemplate = () => {
  return (
    <Flex justify={"center"} p={"xl"}>
      <Image src={NotFoundImage} alt="Not Found" />
    </Flex>
  );
};

export default NotFoundTemplate;
