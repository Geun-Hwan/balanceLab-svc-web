// MobileBalanceGameList.jsx - 모바일용 밸런스 게임 리스트 컴포넌트

import { CATEGORIES } from "@/constants/serviceConstants";

import { FilterType, IUseBalanceGame } from "@/hooks/useBalanceGameList";
import { useUserStore } from "@/store/store";
import {
  Button,
  Checkbox,
  Flex,
  Group,
  Modal,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useNavigate } from "react-router-dom";

const MobileBalanceGameSearchButton = ({
  filters,
  handleCategoryChange,

  handleFilterChange,
  handleDateChange,
  applySearch,
  defaultValue,
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
      });
      return;
    }
    open();
  };

  const handleClose = () => {
    if (setFilters) {
      if (defaultValue) {
        setFilters(defaultValue as FilterType);
      }
    }
    close();
  };

  return (
    <Flex direction={"column"} mt={"md"}>
      <Button
        onClick={handleOpen}
        fullWidth
        variant="light"
        opacity={1}
        style={{ zIndex: 10, outline: "none" }}
        mb={"md"}
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
          name="search"
          placeholder="검색어를 입력하세요"
          value={filters.search}
          onChange={handleFilterChange}
          w={"100%"}
        />

        {/* 종료 여부 */}
        <Title size="sm" mt={20}>
          마감일
        </Title>
        <Group mt={10} mb={10}>
          <DatePickerInput
            maxLevel="month"
            dropdownType="modal"
            valueFormat="YYYY-MM-DD"
            placeholder="날짜 선택"
            value={filters.startDate.toDate()}
            onChange={(v: any) => handleDateChange(v, "startDate")}
            locale="ko"
            flex={1}
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
          />
        </Group>
        <Checkbox
          name="showEnded"
          label="마감된 게임 포함"
          checked={filters.showEnded}
          onChange={handleFilterChange}
          mt={10}
        />

        {/* 카테고리 체크박스 */}
        <Title size="sm" mt={20}>
          카테고리
        </Title>
        <Flex
          wrap="wrap"
          align="center"
          mt={10}
          gap="md" // Flex 항목 사이의 간격
        >
          {CATEGORIES.map((category) => (
            <Checkbox
              value={category.value}
              key={category.value}
              label={category.label}
              checked={filters.categories.includes(category.value)}
              onChange={handleCategoryChange}
              mr={10}
            />
          ))}
        </Flex>

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
    </Flex>
  );
};

export default MobileBalanceGameSearchButton;
