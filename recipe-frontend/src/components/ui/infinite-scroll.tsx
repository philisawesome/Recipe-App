import InfiniteScroll from "react-infinite-scroll-component";

interface ScrollProps<T> {
  fetchMore: () => void;
  hasMore: boolean;
  data: T[];
  renderItem: (item: T) => React.ReactNode;
}
export default function Scroll<T>({
  fetchMore,
  hasMore,
  data,
  renderItem,
}: ScrollProps<T>) {
  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={<p>Loading...</p>}
      endMessage={<p style={{ textAlign: "center" }}>All items loaded.</p>}
    >
      {data.map((item) => renderItem(item))}
    </InfiniteScroll>
  );
}
