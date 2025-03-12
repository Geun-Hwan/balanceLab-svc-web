import { Card, Title } from "@mantine/core";
import React from "react";

const BalanceCard = ({
  data,
  isBlur = false,
}: {
  data: any;
  isBlur?: boolean;
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {};

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius={8}
      mb={20}
      withBorder
      mih={200}
      className={isBlur ? "blur" : ""}
    >
      <Title size="lg" mb="md" ta={"center"}>
        {data?.title}
      </Title>

      {/* <Button fullWidth variant="outline" color="blue">
        선택하기
      </Button> */}
    </Card>
  );
};

export default BalanceCard;
