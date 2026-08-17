function QuyDinhThueView() {
  return (
    <div
      className="khung-trang"
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "32px 20px 48px",
        lineHeight: 1.7,
        color: "#111827",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "28px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            margin: "0 0 8px",
            fontSize: "28px",
          }}
        >
          QUY ĐỊNH THUÊ MÁY ẢNH VÀ THIẾT BỊ ĐIỆN TỬ
        </h1>

        <p
          style={{
            textAlign: "center",
            margin: "0 0 24px",
            fontStyle: "italic",
          }}
        >
          (Áp dụng đối với khách hàng thực hiện giao dịch thuê thiết bị tại T-RENT)
        </p>

        <p>
          Quy định này được áp dụng nhằm giúp Khách thuê hiểu rõ các quyền, nghĩa vụ
          và trách nhiệm trong quá trình thuê, nhận, sử dụng và hoàn trả thiết bị theo
          Hợp đồng cho thuê máy ảnh.
        </p>

        <section style={{ marginTop: "28px" }}>
          <h2>1. ĐẶT CỌC VÀ THANH TOÁN</h2>

          <ol>
            <li>
              Khách thuê có trách nhiệm thanh toán đầy đủ 100% tiền thuê thiết bị tại
              thời điểm ký kết hợp đồng và trước khi nhận bàn giao thiết bị.
            </li>

            <li>
              Mức tiền đặt cọc của từng thiết bị được công bố tại thông tin sản phẩm
              trên hệ thống T-RENT. Tổng số tiền đặt cọc của đơn thuê được xác định
              theo các thiết bị khách hàng lựa chọn và được thể hiện trong Hợp đồng
              cho thuê.
            </li>

            <li>
              Tiền đặt cọc nhằm bảo đảm việc hoàn trả thiết bị và thực hiện nghĩa vụ
              bồi thường thiệt hại nếu có.
            </li>

            <li>
              Sau khi kết thúc hợp đồng:
              <ul>
                <li>
                  Nếu không phát sinh hư hỏng hoặc mất mát, Khách thuê được hoàn trả
                  đầy đủ tiền đặt cọc.
                </li>
                <li>
                  Nếu phát sinh thiệt hại thuộc trách nhiệm của Khách thuê, T-RENT
                  được quyền khấu trừ chi phí bồi thường vào tiền đặt cọc.
                </li>
                <li>
                  Trường hợp tiền đặt cọc không đủ để bù đắp thiệt hại, Khách thuê có
                  trách nhiệm thanh toán phần chênh lệch còn thiếu.
                </li>
              </ul>
            </li>
          </ol>
        </section>

        <section style={{ marginTop: "28px" }}>
          <h2>2. GIAO NHẬN VÀ HOÀN TRẢ THIẾT BỊ</h2>

          <ol>
            <li>
              Người thực hiện đặt thuê trên hệ thống phải là người trực tiếp nhận bàn
              giao và hoàn trả thiết bị.
            </li>

            <li>
              Khi bàn giao, T-RENT có trách nhiệm cung cấp thiết bị đúng chủng loại,
              số lượng, tình trạng và phụ kiện kèm theo như đã thỏa thuận trong Hợp
              đồng và Biên bản bàn giao.
            </li>

            <li>
              T-RENT lập Biên bản bàn giao thiết bị để hai bên xác nhận thông tin về
              thiết bị và phụ kiện được giao.
            </li>

            <li>
              Khi kết thúc thời hạn thuê, Khách thuê có trách nhiệm hoàn trả đầy đủ
              thiết bị, phụ kiện đúng số lượng và tình trạng như khi nhận, trừ hao
              mòn tự nhiên phát sinh trong quá trình sử dụng thông thường.
            </li>
          </ol>
        </section>

        <section style={{ marginTop: "28px" }}>
          <h2>3. BẢO QUẢN VÀ SỬ DỤNG THIẾT BỊ</h2>

          <ol>
            <li>
              Khách thuê có trách nhiệm bảo quản thiết bị trong suốt thời gian thuê
              và sử dụng thiết bị đúng mục đích, đúng công dụng.
            </li>

            <li>
              Thiết bị chỉ được sử dụng để phục vụ công việc, chụp ảnh cá nhân hoặc
              các mục đích hợp pháp khác, không trái quy định của pháp luật.
            </li>

            <li>
              Khách thuê không được cho bên thứ ba thuê hoặc mượn lại thiết bị trong
              thời hạn thuê, trừ trường hợp được T-RENT đồng ý bằng văn bản.
            </li>

            <li>
              Trường hợp T-RENT phát hiện Khách thuê sử dụng thiết bị không đúng mục
              đích hoặc không đúng công dụng, T-RENT có quyền:
              <ul>
                <li>Yêu cầu Khách thuê chấm dứt hành vi vi phạm; hoặc</li>
                <li>
                  Đơn phương chấm dứt hợp đồng, thu hồi thiết bị và yêu cầu bồi
                  thường thiệt hại nếu có.
                </li>
              </ul>
            </li>
          </ol>
        </section>

        <section style={{ marginTop: "28px" }}>
          <h2>4. TRÁCH NHIỆM ĐỐI VỚI HƯ HỎNG, MẤT MÁT</h2>

          <ol>
            <li>
              Hao mòn tự nhiên và các trầy xước nhẹ phát sinh trong quá trình sử dụng
              thông thường không bị coi là vi phạm hợp đồng.
            </li>

            <li>
              Trường hợp mất phụ kiện như pin, sạc, thẻ nhớ, kính lọc hoặc các phụ
              kiện khác đi kèm thiết bị, Khách thuê có trách nhiệm bồi thường theo
              giá thị trường của phụ kiện tại thời điểm xảy ra thiệt hại.
            </li>

            <li>
              Trường hợp thiết bị phát sinh hư hỏng sửa chữa được do lỗi của Khách
              thuê, Khách thuê chịu chi phí sửa chữa thực tế căn cứ trên báo giá của
              hãng hoặc đơn vị sửa chữa do T-RENT chỉ định.
            </li>

            <li>
              Đối với các hư hỏng vật lý bên ngoài có thể xác định ngay khi hoàn trả
              thiết bị như nứt vỡ, trầy xước thấu kính, móp vỏ hoặc các hư hỏng tương
              tự, Khách thuê có trách nhiệm thanh toán chi phí sửa chữa theo quy định
              của Hợp đồng.
            </li>

            <li>
              Trường hợp làm mất thiết bị hoặc thiết bị bị hư hỏng hoàn toàn, Khách
              thuê phải bồi thường theo “Giá trị thiết bị” đã thống nhất trong Hợp
              đồng hoặc giá thị trường tương đương tại thời điểm xảy ra thiệt hại.
            </li>

            <li>
              Nghĩa vụ bồi thường đối với trường hợp mất thiết bị hoặc hư hỏng hoàn
              toàn không bị giới hạn bởi số tiền đặt cọc.
            </li>
          </ol>
        </section>

        <section style={{ marginTop: "28px" }}>
          <h2>5. THỜI GIAN HOÀN TRẢ VÀ CHẬM TRẢ</h2>

          <ol>
            <li>
              Khách thuê có trách nhiệm hoàn trả thiết bị đúng thời gian đã thỏa
              thuận trong Hợp đồng.
            </li>

            <li>
              Trường hợp trả thiết bị chậm so với thời hạn đã thỏa thuận, T-RENT có
              quyền tính thêm tiền thuê theo ngày tương ứng với thời gian chậm trả.
            </li>

            <li>
              Khách thuê chịu trách nhiệm đối với các rủi ro và hư hỏng xảy ra đối
              với thiết bị trong suốt thời gian chậm trả.
            </li>
          </ol>
        </section>

        <section style={{ marginTop: "28px" }}>
          <h2>6. QUYỀN CỦA KHÁCH THUÊ</h2>

          <p>Trong thời gian thực hiện Hợp đồng, Khách thuê có quyền:</p>

          <ol>
            <li>
              Yêu cầu T-RENT cung cấp thiết bị đúng chủng loại, số lượng, tình trạng
              và phụ kiện kèm theo như đã thỏa thuận.
            </li>

            <li>
              Yêu cầu T-RENT sửa chữa thiết bị khi thiết bị phát sinh hư hỏng không
              do lỗi của Khách thuê.
            </li>

            <li>
              Yêu cầu T-RENT sửa chữa, thay thế bằng thiết bị tương đương hoặc có biện
              pháp xử lý phù hợp khi thiết bị gặp hư hỏng hoặc giảm chất lượng sử
              dụng mà không do lỗi của Khách thuê.
            </li>

            <li>
              Được hoàn trả đầy đủ tiền đặt cọc sau khi hoàn thành nghĩa vụ thuê và
              không phát sinh hư hỏng, mất mát thuộc trách nhiệm bồi thường của Khách
              thuê.
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}

export default QuyDinhThueView;
