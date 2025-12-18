import { QuestionStatusCd } from "@/constants/ServiceConstants";
import {
  getPredictionKey,
  IPredictResult,
  modifyPredictTotal,
} from "@/service/predictApi";
import { useAlertStore } from "@/store/store";
import { Button, Modal, Radio, Text, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

const PredictResultSelectModal = ({ data }: { data: IPredictResult }) => {
  const qc = useQueryClient();
  const { showAlert } = useAlertStore();
  const [opened, { open, close }] = useDisclosure(false);

  const { optionA, optionB, optionC, predictId, questionStatusCd, winner } =
    data; // 예측 데이터
  const da: any[] = [];

  const [selectedOption, setSelectedOption] = useState<string | null>(null); // 선택된 결과 옵션

  const { mutate: modifyMutate, isPending: modifyPending } = useMutation({
    mutationFn: (params: { winner: "A" | "B" | "C"; predictId: string }) =>
      modifyPredictTotal(params),
    onMutate: (_variables) => {},
    onSuccess: (data) => {
      handleClose();
      if (data > 0) {
        qc.invalidateQueries({
          queryKey: getPredictionKey({ isMine: true }),
        });

        showAlert("성공적으로 수정되었습니다.", "success");
      }
    },
    onError: (_error) => {
      // 에러가 발생하면, 이전 상태로 되돌립니다.
      modals.close("create_confirm");

      showAlert("오류가 발생했습니다.\n잠시후 다시 시도해주세요.", "error");

      // 에러 처리 (로그 등)
    },
  });

  // 결과 선택 처리

  const handleResultSelect = () => {
    modals.openConfirmModal({
      modalId: "bet_selected",
      centered: true,
      title: "알림",
      children: (
        <Text>
          선택 후에는 수정이 불가능합니다.
          <br /> 선택 항목: <strong>{selectedOption}</strong>
        </Text>
      ),
      labels: { confirm: `선택하기`, cancel: "취소" },
      closeOnConfirm: true,
      onConfirm: () => {
        modifyMutate({
          predictId,
          winner: selectedOption as "A" | "B" | "C",
        });

        handleClose();
      },
    });
  };

  const handleClose = () => {
    setSelectedOption(null);
    close();
  };

  return (
    <>
      {questionStatusCd === QuestionStatusCd.END && !winner && (
        <Button size="xs" onClick={open} loading={modifyPending}>
          결과선택
        </Button>
      )}
      {/* 모달 */}
      <Modal opened={opened} onClose={handleClose} title="결과 선택" centered>
        <Text mb="sm">결과를 선택해 주세요</Text>

        <Radio.Group
          value={selectedOption}
          onChange={setSelectedOption}
          withAsterisk
        >
          <Stack mih={100} justify="center">
            <Radio value="A" label={optionA} />
            <Radio value="B" label={optionB} />
            {optionC && <Radio value="C" label={optionC} />}
          </Stack>
        </Radio.Group>

        <Button
          onClick={handleResultSelect}
          disabled={!selectedOption}
          mt={"lg"}
        >
          결과 확정
        </Button>
      </Modal>
    </>
  );
};

export default PredictResultSelectModal;
