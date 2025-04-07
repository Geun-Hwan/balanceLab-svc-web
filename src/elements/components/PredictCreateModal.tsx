import {
  createPredict,
  getPredictionKey,
  IPredictResult,
  modifyPredict,
  PredictCreateType,
} from "@/service/predictApi";
import { getUserKey } from "@/service/userApi";
import { useAlertStore, useUserStore } from "@/store/store";
import { Button, Modal, Text, TextInput } from "@mantine/core";
import { DatePickerInput, DateTimePicker } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const PredictCreateModal = ({
  data,
  opened,
  close,
  isModify = false,
}: {
  data?: IPredictResult | null;
  opened: boolean;
  close: () => void;
  isModify?: boolean;
}) => {
  const { userData } = useUserStore();
  const navigate = useNavigate();

  const qc = useQueryClient();
  const {
    title,
    predictId,
    optionA,
    optionB,
    optionC,
    strDtm,
    endDtm,
    questionStatusCd,
  } = data || {};
  const { showAlert } = useAlertStore();
  const today = dayjs();

  const [formData, setFormData] = useState<PredictCreateType>({
    title: title ?? "",
    optionA: optionA ?? "",
    optionB: optionB ?? "",
    optionC: optionC ?? "",

    questionStatusCd: questionStatusCd ?? "20000003",
  });
  const [dateTime, setDateTime] = useState({
    strDtm: strDtm ?? today.add(1, "day").startOf("day"),
    endDtm: endDtm ?? today.add(7, "day").endOf("day"),
  });

  const resetForm = () => {
    setFormData({
      title: title ?? "",
      optionA: optionA ?? "",
      optionB: optionB ?? "",
      optionC: optionC ?? "",
      questionStatusCd: questionStatusCd ?? "20000003",
    });
    setDateTime({
      strDtm: strDtm ?? today.add(1, "day").startOf("day"),
      endDtm: endDtm ?? today.add(7, "day").endOf("day"),
    });
  };

  const handleClose = () => {
    resetForm();
    close();
  };

  const { mutate: createMutate, isPending: createPending } = useMutation({
    mutationFn: (params: PredictCreateType) => createPredict(params),
    onMutate: (_variables) => {},
    onSuccess: () => {
      resetForm();

      qc.invalidateQueries({ queryKey: getUserKey({ totalPoint: true }) });
      qc.invalidateQueries({ queryKey: getPredictionKey({ isMine: true }) });
      close();

      showAlert("성공적으로 생성되었습니다.", "success");
      navigate("/my-games#my-rgstr-predict");
    },
    onError: (_error, _variables, _context) => {
      // 에러가 발생하면, 이전 상태로 되돌립니다.

      showAlert("오류가 발생했습니다.\n잠시후 다시 시도해주세요.", "error");
    },
  });

  const { mutate: modifyMutate, isPending: modifyPending } = useMutation({
    mutationFn: (params: PredictCreateType) => modifyPredict(params),
    onMutate: (_variables) => {},
    onSuccess: (data) => {
      modals.close("create_confirm");
      close();
      if (data > 0) {
        qc.invalidateQueries({ queryKey: getUserKey({ totalPoint: true }) });
        qc.invalidateQueries({
          queryKey: getPredictionKey({ isMine: true }),
        });

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

    // 23시 50분부터 00시 10분 사이의 시간대일 경우 등록 불가
    const startRestrictedTime = dayjs().hour(23).minute(50).second(0);
    const endRestrictedTime = dayjs()
      .hour(0)
      .minute(10)
      .second(0)
      .add(1, "day");

    if (
      today.isAfter(startRestrictedTime) &&
      today.isBefore(endRestrictedTime)
    ) {
      showAlert("23:50 ~ 00:10 사이에는 등록할 수 없습니다.");
      return;
    }

    if ((userData?.totalPoint as number) < calculatePoints) {
      showAlert("포인트가 부족합니다.");
      return;
    }

    if (!formData.title || formData.title.trim().length === 0) {
      showAlert("타이틀을 입력해주세요.");
      return;
    }
    if (!formData.optionA || formData.optionA.trim().length === 0) {
      showAlert("optionA는 필수옵션입니다.");
      return;
    }
    if (!formData.optionB || formData.optionB.trim().length === 0) {
      showAlert("optionB는 필수옵션입니다.");
      return;
    }

    modals.openConfirmModal({
      modalId: "create_confirm",
      lockScroll: false,
      centered: true,
      title: "알림",

      children: (
        <Text>
          시작 전까지는 수정 및 삭제가 가능하며, 부적절한 내용이 포함된 경우,
          검수 후 삭제될 수 있습니다.
        </Text>
      ),
      onConfirm: () => {
        formData.strDtm = dateTime.strDtm.format("YYYY-MM-DDTHH:mm:ss");
        formData.endDtm = dateTime.endDtm.format("YYYY-MM-DDTHH:mm:ss");
        if (isModify) {
          formData.predictId = predictId;
          modifyMutate(formData);
        } else {
          createMutate(formData);
        }
      },

      confirmProps: {},
    });
  };

  const calculatePoints = useMemo(() => {
    // 기본 포인트 100p (2일 기준)
    // strDate ,endDate
    if (userData?.userId === "SYSTEM") {
      return 0;
    }
    if (data) {
      return 0;
    }

    return 5000;
  }, [data, userData]);

  const handleDateTimeChange = (
    value: Date | null,
    name: "strDtm" | "endDtm"
  ) => {
    if (value) {
      value.setMinutes(0); // 분을 0으로 설정
      value.setSeconds(0); // 초를 0으로 설정
      setDateTime((prevData) => ({
        ...prevData,
        [name]: dayjs(value),
      }));
    }
  };

  return (
    <Modal
      closeOnEscape={false}
      styles={{ title: { fontSize: 20 } }}
      opened={opened}
      onClose={handleClose}
      title="예측 게임 만들기"
      centered
      lockScroll={false}
    >
      <TextInput
        label="타이틀"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        maxLength={20}
        mt="md"
        inputWrapperOrder={["label", "input", "description", "error"]}
        description="최대 20자까지 입력 가능합니다." // 설명 추가
      />
      <TextInput
        label="옵션 A"
        name="optionA"
        value={formData.optionA}
        onChange={handleChange}
        required
        maxLength={20}
        mt="md"
        description="최대 20자까지 입력 가능합니다." // 설명 추가
        inputWrapperOrder={["label", "input", "description", "error"]}
      />
      <TextInput
        label="옵션 B"
        name="optionB"
        value={formData.optionB}
        onChange={handleChange}
        required
        maxLength={20} // Limit to 20 characters
        mt="md" // Adds margin-top for spacing
        description="최대 20자까지 입력 가능합니다." // 설명 추가
        inputWrapperOrder={["label", "input", "description", "error"]}
      />

      <TextInput
        label="옵션 C"
        name="optionC"
        value={formData.optionC}
        onChange={handleChange}
        placeholder="필요한 경우에만 입력해주세요."
        required={false}
        maxLength={20} // Limit to 20 characters
        mt="md" // Adds margin-top for spacing
        description="최대 20자까지 입력 가능합니다." // 설명 추가
        inputWrapperOrder={["label", "input", "description", "error"]}
      />
      <DatePickerInput
        label="시작 날짜 선택"
        value={dateTime.strDtm}
        onChange={(value) => {
          handleDateTimeChange(value, "strDtm");
        }}
        valueFormat="YYYY-MM-DD HH:mm"
        required
        mt="md"
        inputWrapperOrder={["label", "input", "description", "error"]}
        description="시작일을 선택해주세요."
        minDate={dayjs().add(1, "day").startOf("day").toDate()}
      />
      <DatePickerInput
        label="종료 날짜 선택"
        value={dateTime.endDtm}
        onChange={(value) => {
          handleDateTimeChange(value, "strDtm");
        }}
        valueFormat="YYYY-MM-DD HH:mm"
        required
        mt="md"
        inputWrapperOrder={["label", "input", "description", "error"]}
        description="종료일을 선택해주세요."
        minDate={dayjs(dateTime.strDtm).add(6, "day").toDate()}
        maxDate={dayjs(dateTime.strDtm).add(1, "year").toDate()}
      />
      <Button
        fullWidth
        mt="md"
        onClick={handleCreate}
        loading={createPending || modifyPending}
      >
        {`필요 포인트 ${calculatePoints}p`}
      </Button>
    </Modal>
  );
};

export default PredictCreateModal;
