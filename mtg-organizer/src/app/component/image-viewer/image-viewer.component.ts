import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TbCardsService } from '../../TbCards/tb-cards.service';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {
  @Input() imgSource = '';
  @Input() imgTitle = '';
  @Input() imgDescription = '';

  htmlCard  = '';
  slideOpts = {
    centeredSlides: 'true'
  };

  constructor(
    private modalController: ModalController,
    private TbCards: TbCardsService,
  ) { }

  ngOnInit() {
    var cardId = this.imgSource; //cardID or image path
    this.TbCards.getHtmlCardId(cardId, 'large').then((htmlCard:any) => {
      this.htmlCard = htmlCard;
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
