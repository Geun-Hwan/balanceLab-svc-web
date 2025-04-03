// MobileBalanceGameList.jsx - 모바일용 밸런스 게임 리스트 컴포넌트

import { CATEGORIES } from "@/constants/ServiceConstants";

import { IUseBalanceGame } from "@/hooks/useBalanceGameList";
import { useUserStore } from "@/store/store";
import {
  Box,
  Button,
  Checkbox,
  Group,
  Input,
  Modal,
  MultiSelect,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MobileBalanceGameSearchButton = ({
  filters,
  handleCategoryChange,

  handleFilterChange,
  handleDateChange,
  applySearch,

  setFilters,
}: IUseBalanceGame) => {
  const { isLogin } = useUserStore();

  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();

  const handleOpen = () => {
    if (!isLogin) {
      modals.openConfirmModal({
        modalId: "login_confirm",
        centered: true,
        title: "알림",
        children: <Text>로그인 후에 이용 가능합니다.</Text>,
        labels: { confirm: "로그인하기", cancel: "취소" },
        onConfirm: () => navigate("/login"),
        lockScroll: false,
      });
      return;
    }
    open();
  };

  useEffect(() => {
    if (filters.categories.length > 0) {
      const pillsList = document.querySelector(
        ".mantine-MultiSelect-pillsList"
      );

      if (pillsList) {
        pillsList.scrollTo({
          left: pillsList.scrollWidth,
          behavior: "smooth", // ✅ 부드러운 스크롤 적용
        });
      }
    }
  }, [filters.categories]);

  return (
    <Box my={"md"}>
      <Button
        onClick={handleOpen}
        fullWidth
        variant="light"
        opacity={1}
        style={{ outline: "none" }}
      >
        🔍 검색
      </Button>

      {/* 모달 UI */}
      <Modal
        closeOnEscape={false}
        opened={opened}
        onClose={close}
        title="필터 설정"
        centered
      >
        {/* 검색 필드 */}
        <TextInput
          rightSection={
            <Input.ClearButton
              onClick={() => {
                if (setFilters) {
                  setFilters((prev) => ({ ...prev, search: "" }));
                }
              }}
            />
          }
          name="search"
          placeholder="검색어를 입력하세요"
          value={filters.search}
          onChange={handleFilterChange}
          w={"100%"}
        />

        {/* 종료 여부 */}
        <Title size="sm" mt={20}>
          시작일
        </Title>
        <Group mt={"md"} mb={10}>
          <DatePickerInput
            maxLevel="month"
            dropdownType="modal"
            valueFormat="YYYY-MM-DD"
            placeholder="날짜 선택"
            value={filters.startDate.toDate()}
            onChange={(v: any) => handleDateChange(v, "startDate")}
            locale="ko"
            flex={1}
            modalProps={{ lockScroll: false }}
          />
          <Text>~</Text>
          <DatePickerInput
            maxLevel="month"
            dropdownType="modal"
            valueFormat="YYYY-MM-DD"
            placeholder="날짜 선택"
            value={filters.endDate.toDate()}
            onChange={(v: any) => handleDateChange(v, "endDate")}
            locale="ko"
            flex={1}
            modalProps={{ lockScroll: false }}
          />
        </Group>
        <Checkbox
          name="showEnded"
          label="마감된 게임 포함"
          checked={filters.showEnded}
          onChange={handleFilterChange}
          mt={"md"}
        />

        {/* 카테고리 체크박스 */}
        <Title size="sm" mt={20}>
          카테고리
        </Title>
        <MultiSelect
          mt={"md"}
          styles={{
            pillsList: {
              flexWrap: "nowrap",
              overflowX: "auto",
              msOverflowStyle: "none", // ✅ IE, Edge에서 스크롤바 숨기기
              scrollbarWidth: "none",
            },
          }}
          withCheckIcon
          data={CATEGORIES}
          onChange={handleCategoryChange}
          value={filters.categories ?? []}
          placeholder={filters.categories.length > 0 ? "" : "전체"}
          comboboxProps={{
            transitionProps: {
              transition: "pop",
              duration: 200,
            },
            position: "top",
          }}
          clearable
        />

        {/* 필터 적용 버튼 */}
        <Button
          fullWidth
          mt={20}
          onClick={() => {
            applySearch();

            close();
          }}
        >
          적용하기
        </Button>
      </Modal>
    </Box>
  );
};

export default MobileBalanceGameSearchButton;
