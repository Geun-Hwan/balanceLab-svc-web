import { QuestionStatusCd } from "@/constants/ServiceConstants";
import { getPredictionKey, IPredictResult } from "@/service/predictApi";
import { BettingCreateType, createBetting } from "@/service/selectionApi";
import { useAlertStore, useUserStore } from "@/store/store";
import { calculatePercentage } from "@/utils/predict";
import {
  Badge,
  Button,
  Flex,
  Group,
  Modal,
  NumberInput,
  Progress,
  Radio,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";

const PredictBetMadal = ({
  data,
  opened,
  close,
}: {
  data: IPredictResult;
  opened: boolean;
  close: () => void;
}) => {
  const {
    predictId,
    optionA,
    optionB,
    title,
    optionC,
    payoutA = "2.0",
    payoutB = "2.0",
    payoutC = "2.0",
    countA = 0,
    countB = 0,
    countC = 0,
    choiceType: choice = null,
    participation = false,
    questionStatusCd,
    betPoint: bet,
    winner,
  } = data || {};
  const qc = useQueryClient();
  const { userData } = useUserStore();
  const { showAlert } = useAlertStore();
  const [choiceType, setChoiceType] = useState<string | null>(choice);
  const [betPoint, setBetPoint] = useState<number>(bet || 100);

  const disabled =
    participation || questionStatusCd !== QuestionStatusCd.PROGRESS;

  const { mutate: createSelect, isPending } = useMutation({
    mutationFn: (params: BettingCreateType) => createBetting(params),

    onSuccess: () => {
      close();
      showAlert("참여완료", "success");
      qc.invalidateQueries({ queryKey: getPredictionKey() });

      qc.invalidateQueries({ queryKey: ["public"] });
    },
    onError: (_error) => {
      // 에러가 발생하면, 이전 상태로 되돌립니다.

      showAlert("오류가 발생했습니다.\n잠시후 다시 시도해주세요.", "error");

      // 에러 처리 (로그 등)
    },
  });

  const handleClick = () => {
    const currentTime = dayjs();

    const startRestrictedTime = dayjs().hour(23).minute(50).second(0);
    const endRestrictedTime = dayjs()
      .hour(0)
      .minute(10)
      .second(0)
      .add(1, "day");

    if (
      currentTime.isAfter(startRestrictedTime) &&
      currentTime.isBefore(endRestrictedTime)
    ) {
      showAlert("23:50 ~ 00:10 사이에는 등록할 수 없습니다.");
      return;
    }

    if ((userData?.totalPoint as number) < betPoint) {
      showAlert("포인트가 부족합니다.");
      return;
    }

    if ((userData?.totalPoint as number) < betPoint) {
      showAlert("포인트가 부족합니다.");
      return;
    }

    modals.openConfirmModal({
      modalId: "bet_selected",
      centered: true,
      title: "알림",
      children: (
        <Text>
          선택 후에는 수정이 불가능합니다.
          <br /> 선택 항목: <strong>{choiceType}</strong>
          <br /> 사용 포인트: <strong>{betPoint.toLocaleString()}</strong>
        </Text>
      ),
      labels: { confirm: `선택하기`, cancel: "취소" },
      closeOnConfirm: true,
      onConfirm: () => {
        createSelect({
          predictId,
          choiceType: choiceType as "A" | "B" | "C",
          betPoint,
        });
      },
    });
  };

  return (
    <Modal
      display={!data ? "none" : undefined}
      opened={opened}
      onClose={close}
      title="예측하기"
      styles={{ title: { fontSize: 20 } }}
      centered
      key={predictId}
      closeOnEscape={false}
    >
      <Text
        mih={70}
        size="xl"
        ta="center"
        fw={900}
        lineClamp={2}
        style={{ wordBreak: "break-word" }}
      >
        {title}
      </Text>

      <Radio.Group
        key={choiceType}
        readOnly={disabled}
        value={winner || choiceType}
        onChange={setChoiceType}
        style={{ flexDirection: "column", justifyContent: "center" }}
        withAsterisk
        display={"flex"}
        mih={250}
      >
        <PredictBetMadal.RadioOption
          value="A"
          label={optionA}
          payout={payoutA}
          percent={calculatePercentage(data, countA)}
          selected={choiceType}
          winner={winner}
        />
        <PredictBetMadal.RadioOption
          value="B"
          label={optionB}
          payout={payoutB}
          percent={calculatePercentage(data, countB)}
          selected={choiceType}
          winner={winner}
        />
        {optionC && (
          <PredictBetMadal.RadioOption
            value="C"
            label={optionC}
            payout={payoutC}
            percent={calculatePercentage(data, countC)}
            selected={choiceType}
            winner={winner}
          />
        )}
      </Radio.Group>
      <NumberInput
        mt={"md"}
        label="배팅할 포인트"
        value={betPoint}
        onChange={(val) => setBetPoint(Number(val))}
        min={100}
        startValue={100}
        max={1000}
        readOnly={disabled}
        thousandSeparator
        step={50}
        suffix="P"
        withAsterisk
        error={
          !betPoint || (betPoint < 100 && betPoint > 1000)
            ? "100~1000 사이로 입력해주세요"
            : null
        }
      />

      <Group mt="auto" justify="space-between" pt={"sm"}>
        <Group gap="xs">
          <Text size="sm" fw="bold">
            마감시간
          </Text>
          <Text fw="bolder">
            {dayjs(data?.endDtm).format("YYYY-MM-DD HH:mm")}
          </Text>
        </Group>
      </Group>

      <Button
        mt="md"
        onClick={handleClick}
        fullWidth
        disabled={disabled || !choiceType}
        variant="filled"
        color={participation ? "cyan" : "yellow"}
        loading={isPending}
      >
        {questionStatusCd === QuestionStatusCd.PROGRESS
          ? participation
            ? "참여완료"
            : "참여하기"
          : questionStatusCd === QuestionStatusCd.WAITING
          ? "대기중"
          : "종료됨"}
      </Button>
    </Modal>
  );
};

interface PredictOptionRadioProps {
  value: string;
  label: string;
  payout: number | string;
  percent: number;
  selected: string | null;
  winner?: "A" | "B" | "C" | null;
}

PredictBetMadal.RadioOption = ({
  value,
  label,
  payout,
  percent,
  selected,
  winner,
}: PredictOptionRadioProps) => {
  const isSelected = selected === value;
  const isWinner = winner === value;

  let borderColor = "";

  if (winner) {
    if (isWinner) {
      borderColor = "teal";
    } else if (isSelected && !isWinner) {
      borderColor = "red";
    }
  }

  return (
    <Radio
      color={isWinner ? "teal" : undefined}
      bd={borderColor ? `1px solid ${borderColor}` : ""}
      value={value}
      styles={{
        body: { alignItems: "center" },
        labelWrapper: { flex: 1 },
      }}
      mih={70}
      my={"xs"}
      label={
        <Flex direction="column" gap={5}>
          <Text style={{ wordBreak: "break-all" }} lineClamp={1} ta="left">
            {label}
          </Text>

          <Progress
            value={percent}
            animated
            color={isWinner ? "green" : undefined}
          />

          <Flex justify="space-between" align="center">
            <Flex gap="xs" miw={64}>
              {isSelected && (
                <Badge color="yellow" size="sm" variant="light">
                  내 선택
                </Badge>
              )}

              {winner && isWinner && (
                <Badge color="teal" size="sm" variant="light">
                  적중
                </Badge>
              )}

              {winner && isSelected && !isWinner && (
                <Badge color="red" size="sm" variant="light">
                  미적중
                </Badge>
              )}
            </Flex>

            <Text size="sm" c="dimmed">
              배당률 {payout}
            </Text>
          </Flex>
        </Flex>
      }
    />
  );
};

export default PredictBetMadal;
