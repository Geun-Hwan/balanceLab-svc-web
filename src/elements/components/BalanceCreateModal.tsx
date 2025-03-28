import {
  IQuestionResult,
  QuestionCreateType,
  createQuestion,
  getQuestionKey,
  modifyQuestion,
} from "@/api/questionApi";
import { getUserKey } from "@/api/userApi";
import { CATEGORIES } from "@/constants/serviceConstants";
import { useAlertStore, useUserStore } from "@/store/store";
import { Button, Modal, Select, Text, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import React, { useMemo, useState } from "react";

const BalanceCreateModal = ({
  data,
  opened,
  close,
  isModify = false,
}: {
  data?: IQuestionResult | null;
  opened: boolean;
  close: () => void;
  isModify?: boolean;
}) => {
  const { userData } = useUserStore();
  const qc = useQueryClient();
  const {
    title,
    questionId,
    choiceA,
    choiceB,
    strDate,
    endDate,
    categoryCd,
    questionStatusCd,
  } = data || {};
  const { showAlert } = useAlertStore();
  const today = dayjs();

  const [formData, setFormData] = useState<QuestionCreateType>({
    title: title ?? "",
    choiceA: choiceA ?? "",
    choiceB: choiceB ?? "",

    categoryCd: categoryCd ?? "",
    questionStatusCd: questionStatusCd ?? "20000003",
  });

  const [date, setDate] = useState<{ strDate: Dayjs; endDate: Dayjs }>({
    strDate: strDate
      ? dayjs(strDate).startOf("day")
      : dayjs().add(1, "day").startOf("day"),
    endDate: endDate
      ? dayjs(endDate).endOf("day")
      : dayjs().add(3, "day").endOf("day"),
  });
  const resetForm = () => {
    setFormData({
      title: title ?? "",
      choiceA: choiceA ?? "",
      choiceB: choiceB ?? "",

      categoryCd: categoryCd ?? "",
      questionStatusCd: questionStatusCd ?? "20000003",
    });
    setDate({
      strDate: strDate
        ? dayjs(strDate).startOf("day")
        : dayjs().add(1, "day").startOf("day"),
      endDate: endDate
        ? dayjs(endDate).endOf("day")
        : dayjs().add(3, "day").endOf("day"),
    });
  };
  const { mutate: createMutate } = useMutation({
    mutationFn: (params: QuestionCreateType) => createQuestion(params),
    onMutate: (_variables) => {},
    onSuccess: () => {
      resetForm();

      qc.invalidateQueries({ queryKey: getUserKey({ totalPoint: true }) });
      qc.invalidateQueries({ queryKey: getQuestionKey({ isMine: true }) });
      close();

      showAlert("성공적으로 생성되었습니다.", "success");
    },
    onError: (_error, _variables, _context) => {
      // 에러가 발생하면, 이전 상태로 되돌립니다.

      showAlert("오류가 발생했습니다.\n잠시후 다시 시도해주세요.", "error");
    },
  });

  const { mutate: modifyMutate } = useMutation({
    mutationFn: (params: QuestionCreateType) => modifyQuestion(params),
    onMutate: (_variables) => {},
    onSuccess: (data) => {
      modals.close("create_confirm");
      close();
      if (data > 0) {
        qc.invalidateQueries({ queryKey: getUserKey({ totalPoint: true }) });
        qc.invalidateQueries({ queryKey: getQuestionKey({ isMine: true }) });

        showAlert("성공적으로 수정되었습니다.", "success");
      } else {
        showAlert("수정 가능한 기간이 만료되었습니다.", "warning");
      }
    },
    onError: (_error) => {
      // 에러가 발생하면, 이전 상태로 되돌립니다.
      modals.close("create_confirm");

      showAlert("오류가 발생했습니다.\n잠시후 다시 시도해주세요.", "error");

      // 에러 처리 (로그 등)
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleCreate = () => {
    // close();

    if ((userData?.totalPoint as number) < calculatePoints) {
      showAlert("포인트가 부족합니다.");
      return;
    }

    if (!formData.title || formData.title.trim().length === 0) {
      showAlert("타이틀을 입력해주세요.");
      return;
    }

    if (
      !formData.choiceA ||
      formData.choiceA.trim().length === 0 ||
      !formData.choiceB ||
      formData.choiceB.trim().length === 0
    ) {
      showAlert("선택지를 입력해주세요.");
      return;
    }
    if (!formData.categoryCd) {
      showAlert("카테고리를 선택해주세요.");
      return;
    }

    const isToday = today.isSame(date.strDate, "day");

    console.log(date.strDate);
    modals.openConfirmModal({
      modalId: "create_confirm",
      centered: true,
      title: "알림",

      children: (
        <Text>
          시작 전까지는 수정 및 삭제가 가능하며, 부적절한 내용이 포함된 경우,
          검수 후 삭제될 수 있습니다.
        </Text>
      ),
      onConfirm: () => {
        formData.usedPoint = calculatePoints;
        formData.questionStatusCd = isToday ? "20000001" : "20000003";
        formData.strDate = date.strDate.format("YYYY-MM-DD");
        formData.endDate = date.endDate.format("YYYY-MM-DD");

        if (isModify) {
          formData.questionId = questionId;
          modifyMutate(formData);
        } else {
          createMutate(formData);
        }
      },

      confirmProps: {},
    });
  };

  const getBasePoint = (daysDifference: number) => {
    let basePoints = 100;

    if (daysDifference === 13) {
      return 600;
    }

    if (daysDifference > 6) {
      const repet = daysDifference - 6;
      daysDifference -= repet;

      basePoints += repet * 50;
    }

    if (daysDifference > 2) {
      basePoints += (daysDifference - 2) * 30;
    }

    return basePoints;
  };

  const calculatePoints = useMemo(() => {
    // 기본 포인트 100p (2일 기준)
    // strDate ,endDate

    // 날짜 차이에 따라 포인트 계산 (2일 초과 시 30p 추가)
    const daysDifference = date.endDate.diff(date.strDate, "day");

    const additionalPoints = getBasePoint(daysDifference);
    let alreadyUse = 0;

    if (isModify) {
      const originDifference = dayjs(endDate)
        .endOf("day")
        .diff(dayjs(strDate).startOf("day"), "day");

      alreadyUse = getBasePoint(originDifference);
    }

    return additionalPoints - alreadyUse;
  }, [date.strDate, date.endDate, strDate, endDate, isModify]);

  return (
    <Modal
      closeOnEscape={false}
      styles={{ title: { fontSize: 20 } }}
      opened={opened}
      onClose={close}
      title="밸런스 게임 설정"
      centered
    >
      <TextInput
        label="타이틀"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        maxLength={40}
        mt="md"
        inputWrapperOrder={["label", "input", "description", "error"]}
        description="최대 40자까지 입력 가능합니다." // 설명 추가
      />
      <TextInput
        label="선택지 A"
        name="choiceA"
        value={formData.choiceA}
        onChange={handleChange}
        required
        maxLength={40}
        mt="md"
        description="최대 40자까지 입력 가능합니다." // 설명 추가
        inputWrapperOrder={["label", "input", "description", "error"]}
      />
      <TextInput
        label="선택지 B"
        name="choiceB"
        value={formData.choiceB}
        onChange={handleChange}
        required
        maxLength={40} // Limit to 20 characters
        mt="md" // Adds margin-top for spacing
        description="최대 40자까지 입력 가능합니다." // 설명 추가
        inputWrapperOrder={["label", "input", "description", "error"]}
      />
      <DatePickerInput
        label="시작일"
        locale="ko"
        valueFormat="YYYY-MM-DD"
        value={date.strDate.toDate()}
        onChange={(value) => {
          const strDate = dayjs(value).startOf("day");
          if (strDate.isBefore(today, "day")) {
            showAlert("시작일은 오늘 이후로 선택해야 합니다.", "warning");
            return;
          }

          if (strDate.isAfter(date.endDate, "day")) {
            showAlert("시작일은 종료일보다 이전이어야 합니다.", "warning");
            return;
          }
          if (date.endDate.diff(strDate, "day") > 13) {
            showAlert("기간은 최대 14일까지 선택할 수 있습니다.", "warning");
            return;
          }

          setDate((prev) => ({
            ...prev,
            strDate,
          }));
        }}
        inputWrapperOrder={["label", "input", "description", "error"]}
        required
        description="선택한 날짜 자정부터 시작되며, 오늘 선택 시 즉시 시작됩니다."
        mt="md" // Adds margin-top for spacing
      />
      <DatePickerInput
        label="종료일"
        locale="ko"
        valueFormat="YYYY-MM-DD"
        value={date.endDate.toDate()}
        onChange={(value) => {
          const endDate = dayjs(value).endOf("day");
          if (dayjs(date.strDate).isAfter(endDate, "day")) {
            showAlert("종료일은 시작일 이후로 선택해야 합니다.", "warning");
            return;
          }

          if (endDate.diff(date.strDate, "day") > 13) {
            showAlert("기간은 최대 14일까지 선택할 수 있습니다.", "warning");
            return;
          }

          setDate((prev) => ({
            ...prev,
            endDate,
          }));
        }}
        required
        mt="md" // Adds margin-top for spacing
        description="선택한 날짜의 23:59:59까지 유효합니다."
        inputWrapperOrder={["label", "input", "description", "error"]}
      />
      <Select
        label="카테고리"
        name="categoryCd"
        data={CATEGORIES}
        value={formData.categoryCd}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, categoryCd: value }))
        }
        placeholder="카테고리 선택"
        required
        mt="md" // Adds margin-top for spacing
      />
      <Button fullWidth mt="md" onClick={handleCreate}>
        {calculatePoints >= 0
          ? `필요 포인트 ${calculatePoints}p`
          : `환급 포인트 ${Math.abs(calculatePoints)}p`}
      </Button>
    </Modal>
  );
};

export default BalanceCreateModal;
