import { CATEGORIES } from "@/constants/ServiceConstants";
import { IUseBalanceGame } from "@/hooks/useBalanceGameList";
import {
  Button,
  Checkbox,
  Group,
  Input,
  MultiSelect,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

const PcBalanceGameSearchArea = ({
  filters,
  handleDateChange,
  handleFilterChange,
  applySearch,
  handleCategoryChange,
  setFilters,
}: IUseBalanceGame) => {
  return (
    <Stack mt={"xl"} miw={700}>
      <Group grow>
        <Stack maw={800}>
          <Title size="sm">마감일</Title>
          <Group>
            <DatePickerInput
              maxLevel="month"
              dropdownType="modal"
              name="startDate"
              valueFormat="YYYY-MM-DD"
              placeholder="날짜를 선택하세요."
              value={filters.startDate.toDate()}
              miw={150}
              onChange={(v: any) => handleDateChange(v, "startDate")}
              locale="ko"
            />
            <Text>~</Text>
            <DatePickerInput
              name="endDate"
              miw={150}
              maxLevel="month"
              dropdownType="modal"
              valueFormat="YYYY-MM-DD"
              placeholder="날짜를 선택하세요."
              value={filters.endDate.toDate()}
              onChange={(v: any) => handleDateChange(v, "endDate")}
              locale="ko"
            />
            <Checkbox
              flex={1}
              pl={"md"}
              name="showEnded"
              label="마감된 게임 포함"
              styles={{ label: { overflow: "hidden", flex: 1 } }}
              checked={filters.showEnded}
              onChange={handleFilterChange}
            />
          </Group>
        </Stack>
      </Group>

      {/* 카테고리 체크박스 */}
      <Group grow>
        <Stack maw={800}>
          <Title size="sm" w={500}>
            카테고리
          </Title>
          <MultiSelect
            withCheckIcon
            data={CATEGORIES}
            onChange={handleCategoryChange}
            value={filters.categories ?? []}
            placeholder={filters.categories.length > 0 ? "" : "전체"}
            maxValues={3}
            comboboxProps={{
              transitionProps: {
                transition: "pop",
                duration: 200,
              },
              position: "top",
            }}
            clearable
          />
        </Stack>
      </Group>
      <Group>
        <Stack flex={1}>
          <Title size="sm">키워드 검색</Title>
          <Group flex={1}>
            <TextInput
              flex={1}
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
              min={150}
              placeholder="검색어를 입력하세요"
              value={filters.search}
              onChange={handleFilterChange}
            />
            <Button onClick={applySearch} miw={70} maw={250} flex={1}>
              검색
            </Button>
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
};

export default PcBalanceGameSearchArea;
